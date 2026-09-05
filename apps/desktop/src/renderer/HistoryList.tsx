import type { useWriting } from "./useWriting.js";
import type { Words } from "./words.js";
export function HistoryList({
  writing,
  words: w,
}: {
  writing: ReturnType<typeof useWriting>;
  words: Words;
}) {
  return (
    <div className="history-list">
      {writing.history.map((entry) => (
        <article className="panel change-card" key={entry.id}>
          <div className="change-heading">
            <h2>{entry.kind === "speech" ? w.voice : w.ai}</h2>
            <span className="badge">{w[entry.state]}</span>
          </div>
          {entry.original && <p className="original-text">{entry.original}</p>}
          <p className="result-text">{entry.result}</p>
          <div className="toolbar">
            {entry.state === "suggested" && (
              <>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => writing.accept(entry)}
                >
                  {w.accept}
                </button>
                <button type="button" onClick={() => writing.ignore(entry)}>
                  {w.ignore}
                </button>
              </>
            )}
            {entry.state === "applied" && (
              <button type="button" onClick={() => writing.undo(entry)}>
                {w.undo}
              </button>
            )}
            <button type="button" onClick={() => writing.copy(entry.result)}>
              {w.copy}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
