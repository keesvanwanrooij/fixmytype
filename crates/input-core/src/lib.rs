#![forbid(unsafe_code)]

//! Numeric keyboard-event classification for FixMyType.
//!
//! The crate receives event metadata only. It never receives characters,
//! clipboard data, application names, window titles, or a Windows handle.
//! Its result is a recommendation. A later worker owns every decision about
//! whether an operating-system event is changed.
//! Numeric key sequences can reveal writing. No event history or logging is permitted.

mod calibration;
mod event;
mod policy;

pub use calibration::{
    CalibrationSample, CalibrationStatus, CalibrationSummary, InvalidConfiguration, SampleIntent,
    Sensitivity, TimingTable, summarize_calibration,
};
pub use event::{InputEvent, KeyState, Modifiers, PhysicalKey};
pub use policy::{Classification, InputPolicy};
