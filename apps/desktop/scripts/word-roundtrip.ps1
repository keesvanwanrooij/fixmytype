$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class WordFixtureWindow {
    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
'@
$fixtureRoot = [IO.Path]::GetFullPath($env:FIXMYTYPE_TEST_PROFILE)
if (-not ([IO.Path]::GetFileName($fixtureRoot).StartsWith('fixmytype-targets-'))) {
    throw 'An isolated fixture directory is required.'
}
$documentPath = [IO.Path]::Combine($fixtureRoot, 'post.docx')
$expectedPath = [IO.Path]::Combine($fixtureRoot, 'expected.txt')
$existingProcesses = @(Get-Process WINWORD -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
$word = $null
$document = $null
$owned = $false
try {
    $word = New-Object -ComObject Word.Application
    # CreateObject creates a new Word instance. Never adopt an instance with documents.
    if ($word.Documents.Count -ne 0) { throw 'Word instance is not empty.' }
    $owned = $true
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.AutomationSecurity = 3
    $document = $word.Documents.Open($documentPath, $false, $true, $false)
    [uint32]$fixtureProcessId = 0
    [void][WordFixtureWindow]::GetWindowThreadProcessId([IntPtr]$document.Windows.Item(1).Hwnd, [ref]$fixtureProcessId)
    if ($fixtureProcessId -eq 0 -or $existingProcesses -contains $fixtureProcessId) {
        $owned = $false
        throw 'Word did not create an isolated process.'
    }
    $expected = [IO.File]::ReadAllText($expectedPath).Replace("`r`n", "`n").Replace("`n", "`r") + "`r"
    if ($document.Content.Text -cne $expected) { throw 'Word text fidelity assertion failed.' }
    if ($document.Fields.Count -ne 0 -or $document.Hyperlinks.Count -ne 0) {
        throw 'Plain text unexpectedly became an active field or hyperlink.'
    }
    Write-Output 'PASS installed Word: isolated read-only document, Unicode, tabs, paragraphs and literal markup'
} finally {
    if ($null -ne $document) {
        $document.Close(0)
        [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($document)
    }
    if ($null -ne $word) {
        try {
            $noSave = 0
            if ($owned) { $word.Quit([ref]$noSave) }
        } finally {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($word)
        }
    }
}
