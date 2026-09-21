/**
 * Splits a heading into the site's two-line pattern: word count
 * is halved, and when it's odd the shorter half goes on the
 * first line (e.g. "HERE THERE & EVERYWHERE" -> ["HERE THERE",
 * "& EVERYWHERE"], "STAPATI ARCHITECTS" -> ["STAPATI",
 * "ARCHITECTS"]). A single-word heading has nothing to split,
 * so it's returned as one line.
 *
 * Render the result as one <span className="block"> per line
 * so each consumer keeps its own font size/tracking classes on
 * the parent heading element.
 */
export function splitHeadingLines(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return [text];
  }

  const firstLineCount = Math.floor(words.length / 2);

  return [
    words.slice(0, firstLineCount).join(" "),
    words.slice(firstLineCount).join(" "),
  ];
}
