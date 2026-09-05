use fixmytype_input_core::{
    CalibrationSample, CalibrationStatus, SampleIntent, Sensitivity, TimingTable,
    summarize_calibration,
};
use fixmytype_input_core::{Classification, InputEvent, InputPolicy, PhysicalKey};

fn table() -> TimingTable {
    TimingTable::new([8, 12, 18, 24, 30]).unwrap()
}
fn samples(accidental: u64, deliberate: u64) -> Vec<CalibrationSample> {
    (0..10)
        .flat_map(|_| {
            [
                CalibrationSample::new(accidental, SampleIntent::Accidental),
                CalibrationSample::new(deliberate, SampleIntent::Deliberate),
            ]
        })
        .collect()
}

#[test]
fn sensitivity_and_timing_table_are_explicit_and_bounded() {
    for n in 1..=5 {
        let level = Sensitivity::new(n).unwrap();
        assert_eq!(level.value(), n);
        assert_eq!(
            table().window(level).as_millis(),
            [8, 12, 18, 24, 30][usize::from(n - 1)]
        );
        let policy = InputPolicy::new(table().window(level));
        let previous = InputEvent::key_down(PhysicalKey::new(30), 1000);
        let edge = table().window(level).as_millis() as u64;
        assert_eq!(
            policy.classify(
                Some(previous),
                InputEvent::key_down(PhysicalKey::new(30), 1000 + edge)
            ),
            Classification::SuspiciousRepeat
        );
        assert_eq!(
            policy.classify(
                Some(previous),
                InputEvent::key_down(PhysicalKey::new(30), 1001 + edge)
            ),
            Classification::Preserve
        );
    }
    for n in [0, 6, 255] {
        assert!(Sensitivity::new(n).is_err());
    }
    for values in [
        [0, 1, 2, 3, 4],
        [1, 2, 2, 3, 4],
        [4, 3, 2, 1, 5],
        [10, 20, 30, 40, 101],
    ] {
        assert!(TimingTable::new(values).is_err());
    }
}
#[test]
fn insufficient_ambiguous_invalid_and_excessive_samples_never_propose() {
    assert_eq!(
        summarize_calibration(&[], table()).status,
        CalibrationStatus::InsufficientSamples
    );
    assert_eq!(
        summarize_calibration(&samples(8, 80)[..19], table()).status,
        CalibrationStatus::InsufficientSamples
    );
    assert_eq!(
        summarize_calibration(&samples(20, 20), table()).status,
        CalibrationStatus::OverlappingSamples
    );
    assert_eq!(
        summarize_calibration(&samples(0, 80), table()).status,
        CalibrationStatus::InvalidSamples
    );
    assert_eq!(
        summarize_calibration(&samples(8, 5001), table()).status,
        CalibrationStatus::InvalidSamples
    );
    assert_eq!(
        summarize_calibration(
            &vec![CalibrationSample::new(8, SampleIntent::Accidental); 1001],
            table()
        )
        .status,
        CalibrationStatus::InvalidSamples
    );
    assert_eq!(
        summarize_calibration(&samples(40, 80), table()).status,
        CalibrationStatus::NoSupportedLevel
    );
}
#[test]
fn only_the_lowest_separating_level_is_proposed_and_no_samples_are_retained() {
    let summary = summarize_calibration(&samples(9, 24), table());
    assert_eq!(
        summary.status,
        CalibrationStatus::Suggested(Sensitivity::new(2).unwrap())
    );
    assert_eq!(summary.accidental_count, 10);
    assert_eq!(summary.deliberate_count, 10);
    assert_eq!(
        summarize_calibration(&samples(24, 24), table()).status,
        CalibrationStatus::OverlappingSamples
    );
    assert_eq!(
        summarize_calibration(&samples(23, 24), table()).status,
        CalibrationStatus::NoSupportedLevel
    );
}
