import { useEffect, useRef, useState } from "react";
import {
  PairCapture,
  validProposal,
  type Calibrations,
  type Proposal,
  type Sample,
} from "../shared/calibration.js";
import { cleanKey } from "../shared/typing-filter.js";
import type { SettingsStorageIssue } from "../shared/settings-storage.js";

const words = {
  en: {
    title: "Key calibration",
    intro:
      "Measure one problem key in this test area. Label each pair yourself. Only an accepted level and sample counts are saved. Your writing is not recorded.",
    key: "Choose a key",
    start: "Start calibration",
    prompt:
      "Press this key once. If it repeats by itself, label the pair as unwanted. Otherwise press it a second time deliberately. Do not hold the key or use Shift.",
    area: "Press the selected key here",
    accidental: "The extra press was unwanted",
    deliberate: "I pressed twice deliberately",
    discard: "Discard this pair",
    review: "Review proposal",
    accept: "Accept this key setting",
    cancel: "Cancel calibration",
    remove: "Remove",
    level: "Level",
    saved: "The accepted setting is saved for the FixMyType editor only.",
    unavailable:
      "The operation failed. Nothing new was saved. Check local setup or try again.",
    invalid:
      "Saved calibration data could not be read. Existing bytes have not been changed.",
    insufficient:
      "Label at least 10 unwanted pairs and 10 deliberate pairs before accepting a proposal.",
    overlap:
      "These timings overlap. No safe setting can be proposed from these samples.",
    unsupported:
      "None of the five levels separates these samples. Keep the key unchanged.",
    proposal: "Proposed level",
    limit:
      "This exercise holds at most 60 labelled pairs. Start again to collect different samples.",
    accepted: "Accepted keys",
    interval: "Measured interval",
    samples: "Labelled pairs",
    accidentalCount: "Unwanted pairs",
    deliberateCount: "Deliberate pairs",
    precedence:
      "Accepted key settings override the general sensitivity. Remove a key setting to use the general level again.",
    removed: "The key setting has been removed.",
  },
  nl: {
    title: "Toetskalibratie",
    intro:
      "Meet één probleemtoets in dit testvak. Geef zelf aan of elke dubbele aanslag bedoeld was. Alleen een geaccepteerde stand en aantallen worden opgeslagen. Je schrijfwerk wordt niet opgenomen.",
    key: "Kies een toets",
    start: "Kalibratie starten",
    prompt:
      "Druk deze toets één keer in. Herhaalt hij zichzelf, markeer het paar dan als onbedoeld. Druk anders zelf een tweede keer. Houd de toets niet ingedrukt en gebruik geen Shift.",
    area: "Druk hier de gekozen toets in",
    accidental: "De extra aanslag was onbedoeld",
    deliberate: "Ik drukte bewust twee keer",
    discard: "Dit paar weggooien",
    review: "Voorstel bekijken",
    accept: "Deze toetsinstelling accepteren",
    cancel: "Kalibratie annuleren",
    remove: "Verwijderen",
    level: "Stand",
    saved:
      "De geaccepteerde instelling is opgeslagen voor de FixMyType-editor.",
    unavailable:
      "De actie is mislukt. Er is niets nieuws opgeslagen. Controleer de lokale installatie of probeer opnieuw.",
    invalid:
      "De opgeslagen kalibratie kon niet worden gelezen. De bestaande gegevens zijn niet veranderd.",
    insufficient:
      "Markeer minstens 10 onbedoelde paren en 10 bewuste paren voordat je een voorstel accepteert.",
    overlap:
      "Deze tijden overlappen. Deze metingen leveren geen veilige instelling op.",
    unsupported:
      "Geen van de vijf standen kan deze metingen scheiden. Laat de toets ongewijzigd.",
    proposal: "Voorgestelde stand",
    limit:
      "Deze oefening bewaart maximaal 60 gemarkeerde paren. Begin opnieuw voor andere metingen.",
    accepted: "Geaccepteerde toetsen",
    interval: "Gemeten tijd",
    samples: "Gemarkeerde paren",
    accidentalCount: "Onbedoelde paren",
    deliberateCount: "Bewuste paren",
    precedence:
      "Een geaccepteerde toetsinstelling gaat voor de algemene gevoeligheid. Verwijder de toetsinstelling om weer de algemene stand te gebruiken.",
    removed: "De toetsinstelling is verwijderd.",
  },
};
type Props = {
  language: "nl" | "en";
  values: Calibrations;
  issue?: SettingsStorageIssue;
  save: (values: Calibrations) => SettingsStorageIssue | undefined;
};
export function CalibrationPanel({ language, values, issue, save }: Props) {
  const w = words[language];
  const [code, setCode] = useState("KeyA"),
    [active, setActive] = useState(false);
  const [interval, setInterval] = useState<number | undefined>(undefined);
  const [total, setTotal] = useState(0),
    [busy, setBusy] = useState(false);
  const [proposal, setProposal] = useState<Proposal | undefined>(undefined);
  const [message, setMessage] = useState<keyof typeof w | "">(issue ?? "");
  const capture = useRef(new PairCapture(code)),
    samples = useRef<Sample[]>([]),
    epoch = useRef(0);
  const area = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) area.current?.focus();
  }, [active]);
  useEffect(
    () => () => {
      epoch.current++;
      samples.current = [];
      capture.current.reset();
    },
    [],
  );
  const clear = () => {
    epoch.current++;
    samples.current = [];
    capture.current = new PairCapture(code);
    setInterval(undefined);
    setTotal(0);
    setProposal(undefined);
    setBusy(false);
  };
  const label = (intent?: Sample["intent"]) => {
    if (interval !== undefined && intent && samples.current.length < 60)
      samples.current.push({ interval, intent });
    setTotal(samples.current.length);
    setProposal(undefined);
    setInterval(undefined);
    capture.current.reset();
    area.current?.focus();
  };
  const review = async () => {
    const version = ++epoch.current;
    setBusy(true);
    setProposal(undefined);
    setMessage("");
    try {
      const result = await window.fixMyType.calibrate([...samples.current]);
      if (version !== epoch.current) return;
      if (!validProposal(result)) throw Error("INVALID_PROPOSAL");
      setProposal(result);
    } catch {
      if (version === epoch.current) setMessage("unavailable");
    } finally {
      if (version === epoch.current) setBusy(false);
    }
  };
  const accept = () => {
    if (proposal?.status !== "suggested" || proposal.level === null) return;
    const error = save({
      ...values,
      [code]: {
        level: proposal.level,
        accidentalCount: proposal.accidentalCount,
        deliberateCount: proposal.deliberateCount,
      },
    });
    setMessage(error ?? "saved");
    if (!error) {
      clear();
      setActive(false);
    }
  };
  return (
    <section
      className="panel calibration-panel"
      data-calibration
      aria-labelledby="calibration-title"
    >
      <h2 id="calibration-title">{w.title}</h2>
      <p>{w.intro}</p>
      <p className="help-text">{w.precedence}</p>
      <label>
        {w.key}
        <select
          value={code}
          disabled={active}
          onChange={(e) => {
            setCode(e.target.value);
            setMessage("");
          }}
        >
          {Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(65 + i),
          ).map((key) => (
            <option key={key} value={`Key${key}`}>
              {key}
            </option>
          ))}
        </select>
      </label>
      {!active ? (
        <button
          type="button"
          data-calibration-start
          onClick={() => {
            clear();
            setActive(true);
            setMessage("");
          }}
        >
          {w.start}
        </button>
      ) : (
        <>
          <p>{w.prompt}</p>
          <div
            id="calibration-capture"
            className="calibration-capture"
            ref={area}
            role="group"
            aria-label={w.area}
            tabIndex={0}
            onBlur={() => {
              if (interval === undefined) capture.current.reset();
            }}
            onKeyDown={(e) => {
              if (busy || total >= 60) return;
              const event = { ...e, isComposing: e.nativeEvent.isComposing };
              if (cleanKey(event) && e.code === code) e.preventDefault();
              const next = capture.current.press(event);
              if (next !== undefined) setInterval(next);
            }}
          >
            {code.slice(3)} · {w.area}
          </div>
          <p data-calibration-count>
            {w.samples}: {total}/60 · {w.accidentalCount}:{" "}
            {samples.current.filter((s) => s.intent === "accidental").length} ·{" "}
            {w.deliberateCount}:{" "}
            {samples.current.filter((s) => s.intent === "deliberate").length}
          </p>
          {interval !== undefined && (
            <div data-calibration-pair>
              <p>
                {w.interval}: {interval} ms
              </p>
              <div className="calibration-actions">
                <button
                  type="button"
                  data-label="accidental"
                  disabled={busy}
                  onClick={() => label("accidental")}
                >
                  {w.accidental}
                </button>
                <button
                  type="button"
                  data-label="deliberate"
                  disabled={busy}
                  onClick={() => label("deliberate")}
                >
                  {w.deliberate}
                </button>
                <button type="button" disabled={busy} onClick={() => label()}>
                  {w.discard}
                </button>
              </div>
            </div>
          )}
          {total >= 60 && <p>{w.limit}</p>}
          <div className="calibration-actions">
            <button
              type="button"
              data-calibration-review
              disabled={busy || total === 0 || interval !== undefined}
              onClick={() => void review()}
            >
              {w.review}
            </button>
            <button
              type="button"
              data-calibration-cancel
              onClick={() => {
                clear();
                setActive(false);
                setMessage("");
              }}
            >
              {w.cancel}
            </button>
          </div>
          {proposal && (
            <p role="status">
              {proposal.status === "suggested"
                ? `${w.proposal}: ${proposal.level}`
                : w[proposal.status]}
            </p>
          )}
          {proposal?.status === "suggested" && (
            <button
              type="button"
              className="primary-button"
              data-calibration-accept
              onClick={accept}
            >
              {w.accept}
            </button>
          )}
        </>
      )}
      {message && <p role="status">{w[message]}</p>}
      {Object.keys(values).length > 0 && (
        <div>
          <h3>{w.accepted}</h3>
          {Object.entries(values).map(([key, setting]) => (
            <div className="calibration-saved" key={key}>
              <span>
                {key.slice(3)} · {w.level} {setting.level}
              </span>
              <button
                type="button"
                data-calibration-remove={key}
                aria-label={`${w.remove} ${key.slice(3)}`}
                onClick={() => {
                  const next = { ...values };
                  delete next[key];
                  setMessage(save(next) ?? "removed");
                }}
              >
                {w.remove}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
