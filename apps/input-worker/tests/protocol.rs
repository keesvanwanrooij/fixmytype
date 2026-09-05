use fixmytype_input_worker::serve;
use serde_json::{Value, json};

fn run(input: &str) -> (std::io::Result<()>, Vec<Value>) {
    let mut output = Vec::new();
    let result = serve(std::io::Cursor::new(input), &mut output);
    let lines = String::from_utf8(output)
        .unwrap()
        .lines()
        .map(|line| serde_json::from_str(line).unwrap())
        .collect();
    (result, lines)
}

// An idle or stopped worker must never discover targets. Protocol errors cannot leak payloads.
#[test]
fn explicit_lifecycle_is_idempotent_and_does_not_restore_consent() {
    let mut input = String::new();
    for (id, operation) in [
        "status", "probe", "start", "start", "stop", "stop", "probe", "shutdown", "start",
    ]
    .iter()
    .enumerate()
    {
        input.push_str(&format!(
            "{}\n",
            json!({"version":1,"id":id+1,"operation":operation})
        ));
    }
    let (result, lines) = run(&input);
    result.unwrap();
    assert_eq!(lines.len(), 8);
    assert_eq!(lines[0]["state"], "idle");
    assert_eq!(lines[1]["error"], "NOT_STARTED");
    assert_eq!(lines[2]["state"], "started");
    assert_eq!(lines[2]["epoch"], lines[3]["epoch"]);
    assert_eq!(lines[4]["epoch"], lines[5]["epoch"]);
    assert!(lines[4]["epoch"].as_u64() > lines[3]["epoch"].as_u64());
    assert_eq!(lines[6]["error"], "NOT_STARTED");
    assert_eq!(lines[7]["state"], "closed");
}

#[test]
fn invalid_messages_fail_closed_without_echoing_private_input() {
    for input in [
        r#"{"version":2,"id":1,"operation":"start"}"#,
        r#"{"version":1,"id":1,"operation":"start","private":"secret"}"#,
        r#"{"version":1,"id":1,"operation":"inject"}"#,
        r#"{"version":1,"id":0,"operation":"status"}"#,
        r#"{"version":1,"id":9007199254740992,"operation":"status"}"#,
        "secret",
        "{",
        "",
    ] {
        let (result, lines) = run(&format!("{input}\n"));
        assert!(result.is_err());
        assert_eq!(
            lines,
            vec![json!({"version":1,"id":0,"error":"INVALID_MESSAGE"})]
        );
    }
}

#[test]
fn oversized_or_unterminated_input_is_rejected() {
    for input in [
        "x".repeat(4097),
        "x".repeat(4097) + "\n",
        r#"{"version":1,"id":1,"operation":"start"}"#.into(),
    ] {
        assert!(run(&input).0.is_err());
    }
    assert!(run("").0.is_ok()); // Parent EOF releases the process without a shutdown roundtrip.
}

#[test]
fn request_ids_must_increase() {
    let (_, lines) = run(
        "{\"version\":1,\"id\":1,\"operation\":\"start\"}\n{\"version\":1,\"id\":1,\"operation\":\"status\"}\n",
    );
    assert_eq!(lines.len(), 2);
    assert_eq!(lines[1]["error"], "INVALID_MESSAGE");
}

#[test]
fn calibration_is_advisory_and_does_not_start_observation() {
    let samples: Vec<Value> = (0..20).map(|i| json!({"interval":if i < 10 {12} else {40},"intent":if i < 10 {"accidental"} else {"deliberate"}})).collect();
    let input = format!(
        "{}\n",
        json!({"version":1,"id":1,"operation":"calibrate","samples":samples})
    );
    let (result, lines) = run(&input);
    result.unwrap();
    assert_eq!(lines[0]["state"], "idle");
    assert_eq!(lines[0]["target"], Value::Null);
    assert_eq!(
        lines[0]["calibration"],
        json!({"status":"suggested","level":2,"accidentalCount":10,"deliberateCount":10})
    );
    for invalid in [
        json!({"version":1,"id":1,"operation":"status","samples":[]}),
        json!({"version":1,"id":1,"operation":"status","samples":null}),
        json!({"version":1,"id":1,"operation":"calibrate"}),
        json!({"version":1,"id":1,"operation":"calibrate","samples":[{"interval":0,"intent":"accidental"}]}),
    ] {
        assert!(run(&format!("{invalid}\n")).0.is_err());
    }
}
