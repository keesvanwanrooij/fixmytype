#![forbid(unsafe_code)]

//! Content-free keyboard-event classification for FixMyType.
//!
//! The crate receives event metadata only. It never receives characters,
//! clipboard data, application names, window titles, or a Windows handle.
//! Its result is a recommendation. A later worker owns every decision about
//! whether an operating-system event is changed.

mod event;
mod policy;

pub use event::{InputEvent, KeyState, Modifiers, PhysicalKey};
pub use policy::{Classification, InputPolicy};
