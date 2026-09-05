use std::time::Duration;

/// A user-visible sensitivity level, never a timing default.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Sensitivity(u8);

/// A rejected sensitivity or timing configuration.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct InvalidConfiguration;

impl Sensitivity {
    /// Accepts only levels one through five.
    pub const fn new(value: u8) -> Result<Self, InvalidConfiguration> {
        if value >= 1 && value <= 5 {
            Ok(Self(value))
        } else {
            Err(InvalidConfiguration)
        }
    }
    /// Returns the displayed level.
    #[must_use]
    pub const fn value(self) -> u8 {
        self.0
    }
}

/// Explicit increasing millisecond windows. No default is selected by this crate.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct TimingTable([u64; 5]);

impl TimingTable {
    /// Accepts strictly increasing, nonzero windows at most 100 milliseconds.
    /// The ceiling bounds proposals; it is not evidence of hardware safety.
    pub fn new(windows: [u64; 5]) -> Result<Self, InvalidConfiguration> {
        if windows[0] == 0 || windows[4] > 100 || windows.windows(2).any(|pair| pair[0] >= pair[1])
        {
            return Err(InvalidConfiguration);
        }
        Ok(Self(windows))
    }
    /// Resolves a validated level to the caller's window.
    #[must_use]
    pub fn window(self, sensitivity: Sensitivity) -> Duration {
        Duration::from_millis(self.0[usize::from(sensitivity.0 - 1)])
    }
}

/// The user's explicit label during a visible calibration exercise.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SampleIntent {
    Accidental,
    Deliberate,
}

/// A labelled interval only, with no key, document or timestamp history.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct CalibrationSample {
    interval_millis: u64,
    intent: SampleIntent,
}

impl CalibrationSample {
    /// Constructs an interval for later summary validation.
    #[must_use]
    pub const fn new(interval_millis: u64, intent: SampleIntent) -> Self {
        Self {
            interval_millis,
            intent,
        }
    }
}

/// A proposal requires confirmation in a later UI. It never enables a filter.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum CalibrationStatus {
    InsufficientSamples,
    InvalidSamples,
    OverlappingSamples,
    NoSupportedLevel,
    Suggested(Sensitivity),
}

/// Aggregate counts and an advisory result. No samples are retained.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct CalibrationSummary {
    pub accidental_count: usize,
    pub deliberate_count: usize,
    pub status: CalibrationStatus,
}

/// Summarizes at most 1,000 visible, labelled intervals in linear time.
/// At least ten samples in each group are required. Zero and intervals above
/// five seconds are rejected. Overlap preserves input rather than guessing intent.
#[must_use]
pub fn summarize_calibration(
    samples: &[CalibrationSample],
    table: TimingTable,
) -> CalibrationSummary {
    let mut summary = CalibrationSummary {
        accidental_count: 0,
        deliberate_count: 0,
        status: CalibrationStatus::InvalidSamples,
    };
    if samples.len() > 1000 {
        return summary;
    }
    let mut longest_accidental = 0;
    let mut shortest_deliberate = u64::MAX;
    for sample in samples {
        if sample.interval_millis == 0 || sample.interval_millis > 5000 {
            return summary;
        }
        match sample.intent {
            SampleIntent::Accidental => {
                summary.accidental_count += 1;
                longest_accidental = longest_accidental.max(sample.interval_millis);
            }
            SampleIntent::Deliberate => {
                summary.deliberate_count += 1;
                shortest_deliberate = shortest_deliberate.min(sample.interval_millis);
            }
        }
    }
    summary.status = if summary.accidental_count < 10 || summary.deliberate_count < 10 {
        CalibrationStatus::InsufficientSamples
    } else if longest_accidental >= shortest_deliberate {
        CalibrationStatus::OverlappingSamples
    } else {
        (1..=5)
            .filter_map(|value| Sensitivity::new(value).ok())
            .find(|level| {
                let window = table.window(*level).as_millis();
                window >= u128::from(longest_accidental) && window < u128::from(shortest_deliberate)
            })
            .map_or(
                CalibrationStatus::NoSupportedLevel,
                CalibrationStatus::Suggested,
            )
    };
    summary
}
