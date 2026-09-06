const commands = {
  nl: {
    "opdracht nieuwe alinea": "\n\n",
    "opdracht nieuwe regel": "\n",
    "opdracht komma": ",",
    "opdracht punt": ".",
    "opdracht vraagteken": "?",
    "opdracht uitroepteken": "!",
  },
  en: {
    "command new paragraph": "\n\n",
    "command new line": "\n",
    "command comma": ",",
    "command full stop": ".",
    "command question mark": "?",
    "command exclamation mark": "!",
  },
};

export function formatDictation(
  text: string,
  enabled: boolean,
  language: "nl" | "en" | "auto",
): string {
  if (!enabled) return text;
  const vocabulary: Record<string, string> =
    language === "auto"
      ? { ...commands.nl, ...commands.en }
      : commands[language];
  // Only this fixed vocabulary becomes formatting. There is no command dispatcher.
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${Object.keys(vocabulary).join("|")})(?![\\p{L}\\p{N}_])[,.;:!?]?`,
    "giu",
  );
  let result = "",
    cursor = 0;
  for (const match of text.matchAll(pattern)) {
    result += text.slice(cursor, match.index);
    const replacement = vocabulary[match[1].toLowerCase()];
    result = result.replace(/[ \t]+$/, "") + replacement;
    cursor = match.index + match[0].length;
    if (replacement.startsWith("\n"))
      while (/[ \t]/.test(text[cursor] ?? "")) cursor++;
  }
  return result + text.slice(cursor);
}
