/**
 * Figma mind map uses outlined type (paths), not <text>. Each colored card is a
 * leading <rect /> followed by path geometry until the next rect. This splits the
 * SVG body so each segment can be wrapped in `<g class="mindmap-node">` or `motion.g`.
 */

const SVG_WRAPPER = /^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/i;
const RECT_TAG = /<rect\b[^/]*\/>/g;

export type MindmapNodeParts = {
  /** Attributes string inside `<svg ...>` (leading space included if any). */
  svgAttrs: string;
  /** Content before the first card rect (often a newline). */
  prefix: string;
  /** One segment per node: `<rect />` + following paths until next rect. */
  segments: string[];
  /** From `<defs>` through end of SVG body (filters, defs, trailing paths). */
  suffix: string;
};

/**
 * Split SVG inner markup into [prefix, ...rect-led segments..., suffix from defs].
 * Returns null if structure is not the expected Figma export.
 */
export function splitMindmapByRectNodes(svgMarkup: string): MindmapNodeParts | null {
  const m = svgMarkup.trim().match(SVG_WRAPPER);
  if (!m) return null;

  const svgAttrs = m[1];
  const body = m[2];
  const defsPos = body.indexOf("<defs>");
  if (defsPos === -1) return null;

  RECT_TAG.lastIndex = 0;
  const matches = [...body.matchAll(RECT_TAG)];
  if (matches.length === 0) return null;

  const starts = matches.map((x) => x.index ?? 0);
  const prefix = body.slice(0, starts[0]);
  const segments: string[] = [];

  for (let i = 0; i < matches.length - 1; i++) {
    segments.push(body.slice(starts[i], starts[i + 1]));
  }
  segments.push(body.slice(starts[matches.length - 1], defsPos));
  const suffix = body.slice(defsPos);

  return { svgAttrs, prefix, segments, suffix };
}
