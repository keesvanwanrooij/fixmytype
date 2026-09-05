use fixmytype_input_core::{
    Classification, InputEvent, InputPolicy, KeyState, Modifiers, PhysicalKey,
};
use proptest::prelude::*;
use std::time::Duration;

const REPEAT_WINDOW: Duration = Duration::from_millis(40);

fn key_down(key: u16, timestamp_millis: u64) -> InputEvent {
    InputEvent::key_down(PhysicalKey::new(key), timestamp_millis)
}

fn policy() -> InputPolicy {
    InputPolicy::new(REPEAT_WINDOW)
}

#[test]
fn event_debug_does_not_publish_numeric_key_sequences() {
    assert_eq!(
        format!("{:?}", key_down(30, 123456)),
        "InputEvent { metadata: redacted }"
    );
    assert_eq!(
        format!("{:?}", PhysicalKey::new(30)),
        "PhysicalKey { code: redacted }"
    );
}

#[test]
fn unknown_modifier_bits_never_become_plain_input() {
    for bits in 1..=u8::MAX {
        let flagged = InputEvent::new(
            PhysicalKey::new(30),
            1001,
            KeyState::Down,
            Modifiers::from_bits(bits),
            false,
        );
        assert!(flagged.modifiers().any());
        assert_eq!(
            policy().classify(Some(key_down(30, 1000)), flagged),
            Classification::Preserve
        );
        let prior = InputEvent::new(
            PhysicalKey::new(30),
            1000,
            KeyState::Down,
            Modifiers::from_bits(bits),
            false,
        );
        assert_eq!(
            policy().classify(Some(prior), key_down(30, 1001)),
            Classification::Preserve
        );
    }
}

#[test]
fn equal_timestamps_and_disabled_or_unrepresentable_windows_preserve() {
    assert_eq!(
        policy().classify(Some(key_down(30, 1000)), key_down(30, 1000)),
        Classification::Preserve
    );
    for window in [Duration::ZERO, Duration::from_micros(999), Duration::MAX] {
        assert_eq!(
            InputPolicy::new(window).classify(Some(key_down(30, 1000)), key_down(30, 1001)),
            Classification::Preserve
        );
    }
}

#[test]
fn key_up_baselines_and_deliberate_double_letters_are_preserved() {
    let up = InputEvent::new(
        PhysicalKey::new(30),
        1000,
        KeyState::Up,
        Modifiers::NONE,
        false,
    );
    assert_eq!(
        policy().classify(Some(up), key_down(30, 1001)),
        Classification::Preserve
    );
    for interval in [80, 120, 200] {
        assert_eq!(
            policy().classify(Some(key_down(30, 1000)), key_down(30, 1000 + interval)),
            Classification::Preserve
        );
    }
}

// A first key-down has no previous metadata to compare. It must always be preserved.
#[test]
fn preserves_the_first_key_down() {
    let event = key_down(30, 1_000);

    assert_eq!(policy().classify(None, event), Classification::Preserve);
    assert_eq!(event.state(), KeyState::Down);
}

#[test]
fn marks_an_unmodified_same_key_repeat_inside_the_window_as_suspicious() {
    let previous = key_down(30, 1_000);
    let current = key_down(30, 1_039);

    assert_eq!(
        policy().classify(Some(previous), current),
        Classification::SuspiciousRepeat
    );
}

#[test]
fn documents_the_repeat_window_boundaries() {
    let previous = key_down(30, 1_000);

    assert_eq!(
        policy().classify(Some(previous), key_down(30, 1_039)),
        Classification::SuspiciousRepeat
    );
    assert_eq!(
        policy().classify(Some(previous), key_down(30, 1_040)),
        Classification::SuspiciousRepeat
    );
    assert_eq!(
        policy().classify(Some(previous), key_down(30, 1_041)),
        Classification::Preserve
    );
}

#[test]
fn preserves_different_keys_key_up_modifier_and_injected_events() {
    let previous = key_down(30, 1_000);
    let policy = policy();

    assert_eq!(
        policy.classify(Some(previous), key_down(31, 1_001)),
        Classification::Preserve
    );
    assert_eq!(
        policy.classify(
            Some(previous),
            InputEvent::new(
                PhysicalKey::new(30),
                1_001,
                KeyState::Up,
                Modifiers::NONE,
                false
            )
        ),
        Classification::Preserve
    );
    assert_eq!(
        policy.classify(
            Some(previous),
            InputEvent::new(
                PhysicalKey::new(30),
                1_001,
                KeyState::Down,
                Modifiers::SHIFT,
                false
            )
        ),
        Classification::Preserve
    );
    assert_eq!(
        policy.classify(
            Some(previous),
            InputEvent::new(
                PhysicalKey::new(30),
                1_001,
                KeyState::Down,
                Modifiers::NONE,
                true
            )
        ),
        Classification::Preserve
    );
}

#[test]
fn preserves_events_with_an_invalid_timestamp_order() {
    assert_eq!(
        policy().classify(Some(key_down(30, 1_000)), key_down(30, 999)),
        Classification::Preserve
    );
}

#[test]
fn preserves_when_the_previous_event_has_modifier_or_injected_metadata() {
    let current = key_down(30, 1_001);
    let modified_previous = InputEvent::new(
        PhysicalKey::new(30),
        1_000,
        KeyState::Down,
        Modifiers::CONTROL,
        false,
    );
    let injected_previous = InputEvent::new(
        PhysicalKey::new(30),
        1_000,
        KeyState::Down,
        Modifiers::NONE,
        true,
    );

    assert_eq!(
        policy().classify(Some(modified_previous), current),
        Classification::Preserve
    );
    assert_eq!(
        policy().classify(Some(injected_previous), current),
        Classification::Preserve
    );
}

#[test]
fn only_exposes_the_fixed_content_free_metadata_contract() {
    let event = InputEvent::new(
        PhysicalKey::new(30),
        1_000,
        KeyState::Down,
        Modifiers::from_bits(u8::MAX),
        false,
    );

    assert_eq!(event.key().code(), 30);
    assert_eq!(event.timestamp_millis(), 1_000);
    assert_eq!(event.state(), KeyState::Down);
    assert!(event.modifiers().any());
    assert!(!event.is_injected());
}

proptest! {
    #![proptest_config(ProptestConfig { cases: 512, rng_seed: proptest::test_runner::RngSeed::Fixed(20260905), failure_persistence: None, ..ProptestConfig::default() })]
    #[test]
    fn arbitrary_metadata_obeys_preservation_invariants(
        previous_key in any::<u16>(),
        current_key in any::<u16>(),
        previous_timestamp in any::<u64>(),
        current_timestamp in any::<u64>(),
        previous_is_down in any::<bool>(),
        current_is_down in any::<bool>(),
        previous_modifiers in any::<u8>(),
        current_modifiers in any::<u8>(),
        previous_injected in any::<bool>(),
        current_injected in any::<bool>(),
    ) {
        let previous = InputEvent::new(
            PhysicalKey::new(previous_key),
            previous_timestamp,
            if previous_is_down { KeyState::Down } else { KeyState::Up },
            Modifiers::from_bits(previous_modifiers),
            previous_injected,
        );
        let current = InputEvent::new(
            PhysicalKey::new(current_key),
            current_timestamp,
            if current_is_down { KeyState::Down } else { KeyState::Up },
            Modifiers::from_bits(current_modifiers),
            current_injected,
        );

        let eligible=previous_key==current_key && previous_is_down && current_is_down && previous_modifiers==0 && current_modifiers==0 && !previous_injected && !current_injected && current_timestamp>previous_timestamp && current_timestamp-previous_timestamp<=40;
        prop_assert_eq!(policy().classify(Some(previous), current),if eligible {Classification::SuspiciousRepeat} else {Classification::Preserve});
    }

    #[test]
    fn generated_candidate_intervals_follow_exact_boundaries(key in any::<u16>(), timestamp in 0_u64..u64::MAX-100, elapsed in 0_u64..100) {
        prop_assert_eq!(policy().classify(Some(key_down(key,timestamp)),key_down(key,timestamp+elapsed)),if elapsed>0 && elapsed<=40 {Classification::SuspiciousRepeat} else {Classification::Preserve});
    }
}
