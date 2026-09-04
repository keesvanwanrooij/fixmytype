use crate::{InputEvent, KeyState};
use std::time::Duration;

/// A content-free recommendation for a future caller.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Classification {
    /// The event must remain unchanged.
    Preserve,
    /// The event resembles an accidental physical-key repeat.
    ///
    /// This is not permission to suppress, replace, or delay input.
    SuspiciousRepeat,
}

/// Immutable rules for comparing two adjacent input-event metadata records.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct InputPolicy {
    repeat_window: Duration,
}

impl InputPolicy {
    /// Creates a policy using a caller-supplied repeat window.
    ///
    /// The project intentionally has no product-wide timing default yet.
    #[must_use]
    pub const fn new(repeat_window: Duration) -> Self {
        Self { repeat_window }
    }

    /// Classifies `current` using at most one prior content-free event.
    ///
    /// Only two adjacent, unmodified, non-injected key-down events for the
    /// same physical key can receive `SuspiciousRepeat`. Equal-to-window is
    /// included. Unknown timestamp order and every other case are preserved.
    #[must_use]
    pub fn classify(self, previous: Option<InputEvent>, current: InputEvent) -> Classification {
        let Some(previous) = previous else {
            return Classification::Preserve;
        };

        if !Self::is_repeat_candidate(previous, current) {
            return Classification::Preserve;
        }

        let Some(elapsed_millis) = current
            .timestamp_millis()
            .checked_sub(previous.timestamp_millis())
        else {
            return Classification::Preserve;
        };

        let repeat_window_millis =
            u64::try_from(self.repeat_window.as_millis()).unwrap_or(u64::MAX);
        if elapsed_millis <= repeat_window_millis {
            Classification::SuspiciousRepeat
        } else {
            Classification::Preserve
        }
    }

    fn is_repeat_candidate(previous: InputEvent, current: InputEvent) -> bool {
        previous.key() == current.key()
            && previous.state() == KeyState::Down
            && current.state() == KeyState::Down
            && !previous.modifiers().any()
            && !current.modifiers().any()
            && !previous.is_injected()
            && !current.is_injected()
    }
}
