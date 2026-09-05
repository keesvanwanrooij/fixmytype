use fixmytype_input_core::{
    CalibrationSample, CalibrationStatus, SampleIntent, TimingTable, summarize_calibration,
};
use serde::Deserialize;
use serde_json::json;
use std::io::{self, BufRead, Read, Write};

mod native;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Request {
    version: u8,
    id: u64,
    operation: Operation,
    #[serde(default, deserialize_with = "present_samples")]
    samples: Option<Vec<Sample>>,
}
fn present_samples<'de, D: serde::Deserializer<'de>>(
    input: D,
) -> Result<Option<Vec<Sample>>, D::Error> {
    Vec::<Sample>::deserialize(input).map(Some)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Sample {
    interval: u64,
    intent: Intent,
}
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
enum Intent {
    Accidental,
    Deliberate,
}
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
enum Operation {
    Status,
    Start,
    Stop,
    Probe,
    Shutdown,
    Calibrate,
}

fn send(output: &mut impl Write, value: serde_json::Value) -> io::Result<()> {
    serde_json::to_writer(&mut *output, &value)?;
    output.write_all(b"\n")?;
    output.flush()
}

pub fn serve(mut input: impl BufRead, mut output: impl Write) -> io::Result<()> {
    let mut started = false;
    let mut epoch = 0u64;
    let mut last_id = 0;
    let mut target = None;
    loop {
        // Cap allocation even if the sender never terminates the line.
        let mut line = Vec::new();
        let count = input.by_ref().take(4097).read_until(b'\n', &mut line)?;
        if count == 0 {
            return Ok(());
        }
        let request = serde_json::from_slice::<Request>(&line).ok().filter(|r| {
            count <= 4096
                && line.last() == Some(&b'\n')
                && r.version == 1
                && r.id > last_id
                && r.id <= 9_007_199_254_740_991
                && if matches!(r.operation, Operation::Calibrate) {
                    r.samples.as_ref().is_some_and(|samples| {
                        samples.len() <= 60
                            && samples
                                .iter()
                                .all(|s| s.interval >= 1 && s.interval <= 5000)
                    })
                } else {
                    r.samples.is_none()
                }
        });
        let Some(request) = request else {
            send(
                &mut output,
                json!({"version":1,"id":0,"error":"INVALID_MESSAGE"}),
            )?;
            return Err(io::Error::new(
                io::ErrorKind::InvalidData,
                "INVALID_MESSAGE",
            ));
        };
        last_id = request.id;
        match request.operation {
            Operation::Start if !started => {
                started = true;
                epoch += 1;
            }
            Operation::Stop | Operation::Shutdown if started => {
                started = false;
                epoch += 1;
                target = None;
            }
            Operation::Probe if started => {
                let next = native::foreground();
                if next != target {
                    epoch += 1;
                    target = next;
                }
            }
            _ => {}
        }
        if matches!(request.operation, Operation::Probe) && !started {
            send(
                &mut output,
                json!({"version":1,"id":request.id,"error":"NOT_STARTED"}),
            )?;
        } else {
            let mut response = json!({"version":1,"id":request.id,"state":if matches!(request.operation, Operation::Shutdown) {"closed"} else if started {"started"} else {"idle"},"epoch":epoch,"target":target});
            if let Some(samples) = request.samples {
                let samples: Vec<_> = samples
                    .iter()
                    .map(|s| {
                        CalibrationSample::new(
                            s.interval,
                            match s.intent {
                                Intent::Accidental => SampleIntent::Accidental,
                                Intent::Deliberate => SampleIntent::Deliberate,
                            },
                        )
                    })
                    .collect();
                let summary = summarize_calibration(
                    &samples,
                    TimingTable::new([8, 12, 18, 24, 30]).expect("fixed owned-editor windows"),
                );
                let (status, level) = match summary.status {
                    CalibrationStatus::Suggested(level) => ("suggested", Some(level.value())),
                    CalibrationStatus::InsufficientSamples => ("insufficient", None),
                    CalibrationStatus::OverlappingSamples => ("overlap", None),
                    _ => ("unsupported", None),
                };
                response["calibration"] = json!({"status":status,"level":level,"accidentalCount":summary.accidental_count,"deliberateCount":summary.deliberate_count});
            }
            send(&mut output, response)?;
        }
        if matches!(request.operation, Operation::Shutdown) {
            return Ok(());
        }
    }
}
