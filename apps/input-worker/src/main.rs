fn main() {
    if fixmytype_input_worker::serve(std::io::stdin().lock(), std::io::stdout().lock()).is_err() {
        // No request, key, window title or document text belongs in diagnostics.
        std::process::exit(1);
    }
}
