/// A physical keyboard key represented by the platform-specific numeric code.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct PhysicalKey(u16);

impl PhysicalKey {
    /// Creates a key value from content-free platform metadata.
    #[must_use]
    pub const fn new(code: u16) -> Self {
        Self(code)
    }

    /// Returns the platform-specific numeric key code.
    #[must_use]
    pub const fn code(self) -> u16 {
        self.0
    }
}

/// The direction of a physical keyboard event.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum KeyState {
    /// A key moved down.
    Down,
    /// A key moved up.
    Up,
}

/// Modifier state represented as a small, content-free bit set.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Modifiers(u8);

impl Modifiers {
    /// No modifier is active.
    pub const NONE: Self = Self(0);
    /// Shift is active.
    pub const SHIFT: Self = Self(1 << 0);
    /// Control is active.
    pub const CONTROL: Self = Self(1 << 1);
    /// Alt is active.
    pub const ALT: Self = Self(1 << 2);
    /// The Windows key is active.
    pub const WINDOWS: Self = Self(1 << 3);

    const KNOWN_BITS: u8 = Self::SHIFT.0 | Self::CONTROL.0 | Self::ALT.0 | Self::WINDOWS.0;

    /// Keeps only the modifier bits understood by this crate.
    #[must_use]
    pub const fn from_bits(bits: u8) -> Self {
        Self(bits & Self::KNOWN_BITS)
    }

    /// Returns whether any recognised modifier is active.
    #[must_use]
    pub const fn any(self) -> bool {
        self.0 != 0
    }
}

/// Content-free metadata for one keyboard event.
///
/// All fields are private so callers can construct an event only from this
/// fixed metadata contract. The type deliberately has no text-bearing field.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct InputEvent {
    key: PhysicalKey,
    timestamp_millis: u64,
    state: KeyState,
    modifiers: Modifiers,
    injected: bool,
}

impl InputEvent {
    /// Creates an event from the complete content-free metadata contract.
    #[must_use]
    pub const fn new(
        key: PhysicalKey,
        timestamp_millis: u64,
        state: KeyState,
        modifiers: Modifiers,
        injected: bool,
    ) -> Self {
        Self {
            key,
            timestamp_millis,
            state,
            modifiers,
            injected,
        }
    }

    /// Creates a plain key-down event with no modifier or injected flag.
    #[must_use]
    pub const fn key_down(key: PhysicalKey, timestamp_millis: u64) -> Self {
        Self::new(
            key,
            timestamp_millis,
            KeyState::Down,
            Modifiers::NONE,
            false,
        )
    }

    /// Returns the physical key metadata.
    #[must_use]
    pub const fn key(self) -> PhysicalKey {
        self.key
    }

    /// Returns the event timestamp in milliseconds supplied by the caller.
    #[must_use]
    pub const fn timestamp_millis(self) -> u64 {
        self.timestamp_millis
    }

    /// Returns the event direction.
    #[must_use]
    pub const fn state(self) -> KeyState {
        self.state
    }

    /// Returns the modifier state.
    #[must_use]
    pub const fn modifiers(self) -> Modifiers {
        self.modifiers
    }

    /// Returns whether the event was injected rather than physical input.
    #[must_use]
    pub const fn is_injected(self) -> bool {
        self.injected
    }
}
