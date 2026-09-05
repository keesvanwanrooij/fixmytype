use serde::Serialize;

#[derive(Debug, PartialEq, Eq, Serialize)]
pub struct Metadata {
    target_id: String,
    document_id: Option<String>,
    kind: &'static str,
    read_selection: bool,
    replace_range: bool,
}

#[cfg(not(windows))]
pub fn foreground() -> Option<Metadata> {
    None
}

#[cfg(windows)]
mod windows {
    use super::Metadata;
    use std::{
        mem::{size_of, zeroed},
        ptr::null_mut,
    };
    use windows_sys::Win32::{
        Foundation::{CloseHandle, HWND},
        Security::{GetTokenInformation, TOKEN_ELEVATION, TOKEN_QUERY, TokenElevation},
        System::Threading::{OpenProcess, OpenProcessToken, PROCESS_QUERY_LIMITED_INFORMATION},
        UI::{Input::KeyboardAndMouse::IsWindowEnabled, WindowsAndMessaging::*},
    };

    // Query only process privilege metadata. Every successful handle acquisition is closed.
    fn elevated(pid: u32) -> Option<bool> {
        unsafe {
            let process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid);
            if process.is_null() {
                return None;
            }
            let mut token = null_mut();
            let opened = OpenProcessToken(process, TOKEN_QUERY, &mut token);
            CloseHandle(process);
            if opened == 0 {
                return None;
            }
            let mut value: TOKEN_ELEVATION = zeroed();
            let mut returned = 0;
            let ok = GetTokenInformation(
                token,
                TokenElevation,
                (&mut value as *mut TOKEN_ELEVATION).cast(),
                size_of::<TOKEN_ELEVATION>() as u32,
                &mut returned,
            );
            CloseHandle(token);
            if ok == 0 {
                None
            } else {
                Some(value.TokenIsElevated != 0)
            }
        }
    }

    // HWNDs are borrowed. This function never reads values, changes focus or sends input.
    fn inspect(hwnd: HWND) -> Option<Metadata> {
        unsafe {
            if hwnd.is_null() || IsWindow(hwnd) == 0 {
                return None;
            }
            let mut pid = 0;
            GetWindowThreadProcessId(hwnd, &mut pid);
            let privilege = elevated(pid);
            let mut class = [0u16; 64];
            let length = GetClassNameW(hwnd, class.as_mut_ptr(), class.len() as i32);
            let style = GetWindowLongPtrW(hwnd, GWL_STYLE) as u32;
            let kind = match privilege {
                Some(true) => "elevated",
                None => "unknown",
                Some(false)
                    if String::from_utf16_lossy(&class[..length.max(0) as usize])
                        .eq_ignore_ascii_case("Edit") =>
                {
                    if style & ES_PASSWORD as u32 != 0 {
                        "password"
                    } else if style & ES_READONLY as u32 != 0 {
                        "read-only"
                    } else if IsWindowEnabled(hwnd) == 0 {
                        "disabled"
                    } else {
                        "plain"
                    }
                }
                _ => "unknown",
            };
            Some(Metadata {
                target_id: format!("{pid}:{:x}", hwnd as usize),
                document_id: None,
                kind,
                read_selection: false,
                replace_range: false,
            })
        }
    }

    pub fn foreground() -> Option<Metadata> {
        unsafe {
            let window = GetForegroundWindow();
            if window.is_null() {
                return None;
            }
            let thread = GetWindowThreadProcessId(window, null_mut());
            let mut info: GUITHREADINFO = zeroed();
            info.cbSize = size_of::<GUITHREADINFO>() as u32;
            if thread == 0 || GetGUIThreadInfo(thread, &mut info) == 0 {
                return None;
            }
            let result = inspect(info.hwndFocus);
            let mut after: GUITHREADINFO = zeroed();
            after.cbSize = size_of::<GUITHREADINFO>() as u32;
            if GetForegroundWindow() != window
                || GetGUIThreadInfo(thread, &mut after) == 0
                || after.hwndFocus != info.hwndFocus
            {
                return None;
            }
            result
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        // These are real, hidden Windows EDIT controls containing only synthetic text.
        #[test]
        fn controlled_windows_fields_never_gain_external_write_rights() {
            let class: Vec<u16> = "Edit\0".encode_utf16().collect();
            let content: Vec<u16> = "synthetic unchanged\0".encode_utf16().collect();
            for (style, kind) in [
                (0, "plain"),
                (ES_PASSWORD as u32, "password"),
                (ES_READONLY as u32, "read-only"),
                (WS_DISABLED, "disabled"),
            ] {
                unsafe {
                    let hwnd = CreateWindowExW(
                        0,
                        class.as_ptr(),
                        content.as_ptr(),
                        WS_POPUP | style,
                        0,
                        0,
                        100,
                        30,
                        null_mut(),
                        null_mut(),
                        null_mut(),
                        std::ptr::null(),
                    );
                    assert!(!hwnd.is_null());
                    let metadata = inspect(hwnd).unwrap();
                    let mut actual = [0u16; 64];
                    let length = GetWindowTextW(hwnd, actual.as_mut_ptr(), 64);
                    DestroyWindow(hwnd);
                    assert_eq!(metadata.kind, kind);
                    assert!(!metadata.replace_range && !metadata.read_selection);
                    assert_eq!(
                        String::from_utf16_lossy(&actual[..length as usize]),
                        "synthetic unchanged"
                    );
                }
            }
            assert_eq!(inspect(null_mut()), None);
        }
    }
}
#[cfg(windows)]
pub use windows::foreground;
