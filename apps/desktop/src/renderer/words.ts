import type { InterfaceLanguage } from "../shared/settings.js";
const en = {
  workspace: "Write",
  history: "History",
  setup: "Local setup",
  settings: "Settings",
  local: "Your words stay here.",
  title: "Make room for your words.",
  subtitle:
    "A writing space for imperfect keyboards. Choose how much help you want.",
  editor: "Your text",
  placeholder: "Start a prompt, draft a post, or get a thought down…",
  profile: "Writing profile",
  prose: "Everyday writing",
  prompt: "AI prompts",
  code: "Code and commands",
  spreadsheet: "Spreadsheet text",
  mode: "AI assistance",
  off: "Off",
  suggest: "Suggest",
  automatic: "Automatic",
  modeHelp:
    "AI checks completed sentences after a short pause. Suggest waits for you. Automatic applies safe results while you keep typing. Review the history: AI can misread your meaning.",
  repairNow: "Repair text / selection",
  startRecording: "Dictate",
  spokenFormatting: "Use spoken formatting for this session",
  spokenFormattingHelp:
    "Say command new paragraph, command new line, command comma, command full stop, command question mark or command exclamation mark. Dutch uses opdracht. The repair language chooses the command language; Detect accepts both. Other phrases stay literal. Review the transcript in history and use Undo if needed.",
  literalDictationHelp:
    "Dictation is literal. Enable spoken formatting before recording if you want to dictate paragraph breaks or punctuation commands.",
  stopRecording: "Stop recording",
  transcribing: "Transcribing…",
  repairing: "Repairing…",
  copy: "Copy text",
  wordHeading: "Continue in Word",
  wordHelp:
    "Save the text currently in the editor as a new Word document. Suggestions are not included until you accept them. Later changes are not synced.",
  saveWord: "Save Word document",
  openWord: "Open saved document",
  wordSaving: "Saving…",
  wordSaved: "Your Word document is saved. You can open it below.",
  wordCancelled: "Saving was cancelled. Your draft is unchanged.",
  wordError:
    "Saving failed. Choose a new .docx filename in a writable folder. Existing documents are never overwritten.",
  wordOpened:
    "The saved document was sent to your default .docx app. You can continue editing there.",
  wordOpenError:
    "The document could not open. Open the saved file from its folder and check your default .docx app.",
  wordOutdated:
    "Your draft has changed since saving. Save a new document to include those changes.",
  cancel: "Cancel",
  filterHere: "Filter rapid repeated letters",
  workspaceHelp:
    "Write here, then copy to your browser, Word or another app. Dictation inserts at the selection where recording started.",
  accept: "Accept",
  ignore: "Ignore",
  undo: "Undo",
  suggested: "Suggestion",
  applied: "Applied",
  stale: "Kept as a draft",
  ignored: "Ignored",
  undone: "Undone",
  recordingNow:
    "Microphone is recording. Stop to transcribe. Maximum 115 seconds.",
  runtimeError: "The local service did not respond. Check Local setup.",
  repairError:
    "Repair failed or changed protected text. Your original remains. Check Local setup or try a shorter selection.",
  speechError:
    "Transcription failed. Check Local setup. Your existing text is unchanged.",
  microphoneError:
    "Microphone access failed. Check Windows microphone permissions and your input device.",
  noSpeech:
    "No usable speech was detected. Try again closer to the microphone.",
  unchanged: "No correction was needed.",
  repairDone: "The result is in your history below.",
  dictated: "Dictation was inserted. You can undo it below.",
  staleResult:
    "Your text changed while processing. The result stays in history for you to copy.",
  cancelled: "Cancelled. Your text is unchanged.",
  copied: "Copied. Paste it where you want to use it.",
  copyError: "Copy failed. Select the text and use Control+C.",
  aiReady: "Local AI is available",
  speechReady: "Local dictation is available",
  checkAgain: "Check again",
  aiSetup:
    "Uses your local Ollama installation with llama3.2:3b. Start Ollama and run ollama pull llama3.2:3b if it is missing. Cloud aliases are rejected.",
  speechSetup:
    "Uses whisper.cpp and multilingual base locally. From apps/desktop, run npm run setup:speech once. Recording only starts when you choose Dictate.",
  protection: "Typing protection",
  sensitivity: "Keyboard sensitivity",
  intensity: "Repair intensity",
  language: "Language",
  interfaceLanguage: "App language",
  repairLanguage: "Repair language",
  detect: "Detect language",
  personal: "Your writing",
  style: "Your style card",
  styleHelp: "Describe how you write. Only guidance you save is used.",
  vocabulary: "Your vocabulary",
  vocabularyHelp: "One name or term per line. Up to 200 entries.",
  keys: "Keyboard shortcuts",
  keysHelp:
    "Use at least two modifiers, for example Control+Alt+D. Changes are checked before registration.",
  dictate: "Toggle dictation",
  repair: "Repair selection",
  read: "Read aloud",
  pause: "Pause protection",
  show: "Show workspace",
  save: "Save preferences",
  saved: "Preferences saved.",
  invalid: "Check levels, vocabulary and shortcut conflicts.",
  unavailable:
    "Local storage is unavailable. Your previous saved choices remain.",
  shortcutError:
    "A shortcut is unavailable. Review Keyboard shortcuts in Settings. Any previous working bindings were restored.",
  status: "Local status",
  foundation: "Workspace ready",
  nativePending: "System-wide typing protection is not connected yet.",
  aiPending: "Local repair is not connected yet.",
  speechPending:
    "Speech setup will appear here when the local provider is connected.",
  characters: "characters",
  words: "words",
  session: "This draft stays in this session.",
  support: "Support FixMyType",
  historyTitle: "Keep the changes that help.",
  historyBody: "There are no committed changes in this session.",
  setupTitle: "Everything runs on your computer.",
  setupBody:
    "Each component reports its own readiness. An installed runtime is not a completed connection.",
  typing: "Typing",
  ai: "Text repair",
  voice: "Speech",
  pending: "Not connected",
  ready: "Ready",
  companion: "Show companion control",
  close: "Back to writing",
  footer: "Free and open source. Built for your keyboard.",
  operationPending:
    "This shortcut is configured. Its local service is not connected yet.",
  reset: "Reset invalid preferences",
} as const;
type Words = { [K in keyof typeof en]: string };
const nl: Words = {
  workspace: "Schrijven",
  history: "Geschiedenis",
  setup: "Lokale installatie",
  settings: "Instellingen",
  local: "Je woorden blijven hier.",
  title: "Geef je woorden de ruimte.",
  subtitle:
    "Een schrijfplek voor een onvolmaakt toetsenbord. Jij bepaalt hoeveel hulp je krijgt.",
  editor: "Je tekst",
  placeholder:
    "Begin een prompt, schrijf een bericht of leg een gedachte vast…",
  profile: "Schrijfprofiel",
  prose: "Gewone tekst",
  prompt: "AI-prompts",
  code: "Code en opdrachten",
  spreadsheet: "Tekst in spreadsheets",
  mode: "AI-hulp",
  off: "Uit",
  suggest: "Voorstellen",
  automatic: "Automatisch",
  modeHelp:
    "AI controleert afgeronde zinnen na een korte pauze. Voorstellen wacht op jou. Automatisch past veilige resultaten toe terwijl je verder typt. Controleer de geschiedenis: AI kan je bedoeling verkeerd begrijpen.",
  repairNow: "Tekst / selectie herstellen",
  startRecording: "Dicteren",
  spokenFormatting: "Gesproken opmaak gebruiken in deze sessie",
  spokenFormattingHelp:
    "Zeg opdracht nieuwe alinea, opdracht nieuwe regel, opdracht komma, opdracht punt, opdracht vraagteken of opdracht uitroepteken. Engels gebruikt command. De taal voor herstel bepaalt de opdrachttaal; Taal herkennen accepteert beide. Andere zinnen blijven letterlijk. Controleer de transcriptie in de geschiedenis en maak wijzigingen zo nodig ongedaan.",
  literalDictationHelp:
    "Dictatie is letterlijk. Zet gesproken opmaak aan voordat je opneemt als je alinea's of leestekens wilt dicteren.",
  stopRecording: "Opname stoppen",
  transcribing: "Spraak omzetten…",
  repairing: "Tekst herstellen…",
  copy: "Tekst kopiëren",
  wordHeading: "Verder in Word",
  wordHelp:
    "Sla de tekst in de editor op als een nieuw Word-document. Voorstellen gaan pas mee nadat je ze accepteert. Latere wijzigingen worden niet gesynchroniseerd.",
  saveWord: "Word-document opslaan",
  openWord: "Opgeslagen document openen",
  wordSaving: "Opslaan…",
  wordSaved: "Je Word-document is opgeslagen. Je kunt het hieronder openen.",
  wordCancelled: "Opslaan is geannuleerd. Je concept is niet gewijzigd.",
  wordError:
    "Opslaan is mislukt. Kies een nieuwe .docx-bestandsnaam in een beschrijfbare map. Bestaande documenten worden nooit overschreven.",
  wordOpened:
    "Het opgeslagen document is naar je standaardapp voor .docx gestuurd. Daar kun je verder schrijven.",
  wordOpenError:
    "Het document kon niet openen. Open het opgeslagen bestand vanuit de map en controleer je standaardapp voor .docx.",
  wordOutdated:
    "Je concept is sinds het opslaan gewijzigd. Sla een nieuw document op om die wijzigingen mee te nemen.",
  cancel: "Annuleren",
  filterHere: "Snelle dubbele letters filteren",
  workspaceHelp:
    "Schrijf hier en kopieer naar je browser, Word of een andere app. Dictatie komt bij de selectie waar je de opname startte.",
  accept: "Accepteren",
  ignore: "Negeren",
  undo: "Ongedaan maken",
  suggested: "Voorstel",
  applied: "Toegepast",
  stale: "Als concept bewaard",
  ignored: "Genegeerd",
  undone: "Ongedaan gemaakt",
  recordingNow:
    "Je microfoon neemt op. Stop om de spraak om te zetten. Maximaal 115 seconden.",
  runtimeError:
    "De lokale dienst reageert niet. Controleer Lokale installatie.",
  repairError:
    "Herstel is mislukt of veranderde beschermde tekst. Je origineel blijft staan. Controleer Lokale installatie of probeer een kortere selectie.",
  speechError:
    "Spraak omzetten is mislukt. Controleer Lokale installatie. Je bestaande tekst is niet gewijzigd.",
  microphoneError:
    "De microfoon is niet beschikbaar. Controleer de microfoonrechten in Windows en je invoerapparaat.",
  noSpeech:
    "Er is geen bruikbare spraak gevonden. Probeer het opnieuw dichter bij de microfoon.",
  unchanged: "Er was geen correctie nodig.",
  repairDone: "Het resultaat staat hieronder in je geschiedenis.",
  dictated: "Je dictatie is ingevoegd. Hieronder kun je dit ongedaan maken.",
  staleResult:
    "Je tekst is tijdens de verwerking gewijzigd. Het resultaat blijft in de geschiedenis om te kopiëren.",
  cancelled: "Geannuleerd. Je tekst is niet gewijzigd.",
  copied: "Gekopieerd. Plak de tekst waar je hem wilt gebruiken.",
  copyError: "Kopiëren is mislukt. Selecteer de tekst en gebruik Control+C.",
  aiReady: "Lokale AI is beschikbaar",
  speechReady: "Lokale dictatie is beschikbaar",
  checkAgain: "Opnieuw controleren",
  aiSetup:
    "Gebruikt je lokale Ollama-installatie met llama3.2:3b. Start Ollama en voer ollama pull llama3.2:3b uit als deze ontbreekt. Cloudvarianten worden geweigerd.",
  speechSetup:
    "Gebruikt whisper.cpp en het meertalige base-bestand lokaal. Voer vanuit apps/desktop eenmalig npm run setup:speech uit. Opnemen begint alleen als je Dicteren kiest.",
  protection: "Typbescherming",
  sensitivity: "Toetsenbordgevoeligheid",
  intensity: "Herstelintensiteit",
  language: "Taal",
  interfaceLanguage: "Taal van de app",
  repairLanguage: "Taal voor herstel",
  detect: "Taal herkennen",
  personal: "Jouw schrijfstijl",
  style: "Je stijlkaart",
  styleHelp:
    "Beschrijf hoe je schrijft. Alleen opgeslagen aanwijzingen worden gebruikt.",
  vocabulary: "Je woordenlijst",
  vocabularyHelp: "Eén naam of term per regel. Maximaal 200 woorden.",
  keys: "Sneltoetsen",
  keysHelp:
    "Gebruik minimaal twee speciale toetsen, bijvoorbeeld Control+Alt+D. Wijzigingen worden gecontroleerd.",
  dictate: "Dicteren starten of stoppen",
  repair: "Selectie herstellen",
  read: "Voorlezen",
  pause: "Bescherming pauzeren",
  show: "Schrijfplek openen",
  save: "Voorkeuren opslaan",
  saved: "Voorkeuren opgeslagen.",
  invalid: "Controleer standen, woordenlijst en dubbele sneltoetsen.",
  unavailable:
    "Lokale opslag is niet beschikbaar. Eerder opgeslagen keuzes blijven staan.",
  shortcutError:
    "Een sneltoets is niet beschikbaar. Controleer Sneltoetsen in Instellingen. Eerder werkende toetsen zijn hersteld.",
  status: "Lokale status",
  foundation: "Schrijfplek klaar",
  nativePending: "Typbescherming in andere apps is nog niet verbonden.",
  aiPending: "Lokaal tekstherstel is nog niet verbonden.",
  speechPending:
    "Spraakinstellingen verschijnen hier zodra de lokale dienst is verbonden.",
  characters: "tekens",
  words: "woorden",
  session: "Dit concept blijft in deze sessie.",
  support: "Support FixMyType",
  historyTitle: "Bewaar de veranderingen die helpen.",
  historyBody: "Er zijn nog geen toegepaste wijzigingen in deze sessie.",
  setupTitle: "Alles draait op je computer.",
  setupBody:
    "Elk onderdeel toont zijn eigen status. Een geïnstalleerde dienst is nog geen werkende verbinding.",
  typing: "Typen",
  ai: "Tekstherstel",
  voice: "Spraak",
  pending: "Niet verbonden",
  ready: "Klaar",
  companion: "Companionknop tonen",
  close: "Terug naar schrijven",
  footer: "Gratis en open source. Gebouwd voor jouw toetsenbord.",
  operationPending:
    "Deze sneltoets is ingesteld. De lokale dienst is nog niet verbonden.",
  reset: "Ongeldige voorkeuren resetten",
};
export const wordsFor = (language: InterfaceLanguage): Words =>
  language === "nl" ? nl : en;
export type { Words };
