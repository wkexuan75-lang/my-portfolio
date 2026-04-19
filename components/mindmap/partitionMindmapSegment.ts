/**
 * Splits rect-led segments into card vs wire runs, then lifts `<circle>` clusters
 * (Filter / Personal center) out of wire HTML into their own interactive card runs.
 */

export type MindmapSegmentRun = {
  kind: "card" | "wire";
  html: string;
};

const RECT_SELF_CLOSE = /<rect\b[^/]*\/>/;
const PATH_SELF_CLOSE = /<path\b[\s\S]*?\/>/g;

const BOUNDS_PAD = 36;

export type RectBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function parseRectBounds(rectTag: string): RectBounds | null {
  const wM = rectTag.match(/\bwidth="([\d.]+)"/);
  const hM = rectTag.match(/\bheight="([\d.]+)"/);
  if (!wM || !hM) return null;
  const w = Number(wM[1]);
  const h = Number(hM[1]);

  let x = 0;
  let y = 0;
  const xM = rectTag.match(/\bx="([\d.-]+)"/);
  const yM = rectTag.match(/\by="([\d.-]+)"/);
  if (xM) x = Number(xM[1]);
  if (yM) y = Number(yM[1]);

  const tr = rectTag.match(
    /transform="translate\(\s*([\d.-]+)\s+([\d.-]+)\s*\)"/,
  );
  if (tr) {
    x += Number(tr[1]);
    y += Number(tr[2]);
  }

  return { minX: x, minY: y, maxX: x + w, maxY: y + h };
}

function parseCircleBounds(circleTag: string): RectBounds | null {
  const cxM = circleTag.match(/\bcx="([\d.-]+)"/);
  const cyM = circleTag.match(/\bcy="([\d.-]+)"/);
  const rM = circleTag.match(/\br="([\d.-]+)"/);
  if (!cxM || !cyM || !rM) return null;
  const cx = Number(cxM[1]);
  const cy = Number(cyM[1]);
  const r = Number(rM[1]);
  return { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r };
}

function firstMoveToAbs(d: string | undefined): { x: number; y: number } | null {
  if (!d) return null;
  const m = d.match(/[Mm]\s*([-\d.]+)[\s,]+([-\d.]+)/);
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

function inExpandedCard(
  pt: { x: number; y: number },
  b: RectBounds,
  pad: number,
): boolean {
  return (
    pt.x >= b.minX - pad &&
    pt.x <= b.maxX + pad &&
    pt.y >= b.minY - pad &&
    pt.y <= b.maxY + pad
  );
}

function mergeRuns(runs: MindmapSegmentRun[]): MindmapSegmentRun[] {
  const out: MindmapSegmentRun[] = [];
  for (const r of runs) {
    if (!r.html) continue;
    const last = out[out.length - 1];
    if (last && last.kind === r.kind) {
      last.html += r.html;
    } else {
      out.push({ kind: r.kind, html: r.html });
    }
  }
  return out;
}

function scanPathsAfterAnchor(
  afterAnchor: string,
  bounds: RectBounds,
): MindmapSegmentRun[] {
  const tokens: MindmapSegmentRun[] = [];
  let cursor = 0;
  const pathRe = new RegExp(PATH_SELF_CLOSE.source, PATH_SELF_CLOSE.flags);
  let pm: RegExpExecArray | null;
  while ((pm = pathRe.exec(afterAnchor)) !== null) {
    const gap = afterAnchor.slice(cursor, pm.index);
    if (gap.trim()) {
      tokens.push({ kind: "wire", html: gap });
    }

    const pathHtml = pm[0];
    const dM = pathHtml.match(/\bd="([^"]*)"/);
    const pt = firstMoveToAbs(dM?.[1]);
    const onCard =
      pt !== null && inExpandedCard(pt, bounds, BOUNDS_PAD);

    tokens.push({
      kind: onCard ? "card" : "wire",
      html: pathHtml,
    });
    cursor = pm.index + pathHtml.length;
  }

  const tail = afterAnchor.slice(cursor);
  if (tail.trim()) {
    tokens.push({ kind: "wire", html: tail });
  }

  return tokens;
}

/**
 * Rect at segment start + paths classified vs rect bounds.
 */
function partitionRectLedSegment(segment: string): MindmapSegmentRun[] {
  const rm = RECT_SELF_CLOSE.exec(segment);
  if (!rm || rm.index === undefined) {
    return [{ kind: "wire", html: segment }];
  }

  const rectStart = rm.index;
  const rectEnd = rectStart + rm[0].length;
  const beforeRect = segment.slice(0, rectStart);
  const rectHtml = rm[0];
  const afterRect = segment.slice(rectEnd);

  const bounds = parseRectBounds(rectHtml);
  if (!bounds) {
    return [{ kind: "card", html: segment }];
  }

  const tokens: MindmapSegmentRun[] = [];
  if (beforeRect.trim()) {
    tokens.push({ kind: "wire", html: beforeRect });
  }

  tokens.push({ kind: "card", html: rectHtml });
  tokens.push(...scanPathsAfterAnchor(afterRect, bounds));

  return mergeRuns(tokens);
}

const CIRCLE_LEAD = /^<circle\b[^/]*\/>/;

/**
 * `<circle/>` at block start + paths vs circle bounds (left/right hub nodes).
 */
function partitionCircleLedBlock(html: string): MindmapSegmentRun[] {
  const trimmed = html.trimStart();
  const cm = CIRCLE_LEAD.exec(trimmed);
  if (!cm) {
    return [{ kind: "wire", html }];
  }

  const circleTag = cm[0];
  const afterCircle = trimmed.slice(circleTag.length);
  const bounds = parseCircleBounds(circleTag);
  if (!bounds) {
    return [{ kind: "card", html: trimmed }];
  }

  const tokens: MindmapSegmentRun[] = [{ kind: "card", html: circleTag }];
  tokens.push(...scanPathsAfterAnchor(afterCircle, bounds));

  return mergeRuns(tokens);
}

/**
 * Split wire runs that embed `<circle>` hubs into separate interactive card runs.
 */
function expandRunsWithCircleNodes(runs: MindmapSegmentRun[]): MindmapSegmentRun[] {
  const out: MindmapSegmentRun[] = [];

  for (const run of runs) {
    if (run.kind !== "wire" || !/<circle\b/.test(run.html)) {
      out.push(run);
      continue;
    }

    const pieces = run.html.split(/(?=<circle\b)/);
    for (const piece of pieces) {
      if (!piece.trim()) continue;
      const p = piece.trimStart();
      if (p.startsWith("<circle")) {
        out.push(...partitionCircleLedBlock(p));
      } else {
        out.push({ kind: "wire", html: piece });
      }
    }
  }

  return mergeRuns(out);
}

/**
 * Full partition: rect cards + connector wires + circle hub cards.
 */
export function partitionMindmapSegment(segment: string): MindmapSegmentRun[] {
  const rectRuns = partitionRectLedSegment(segment);
  return mergeRuns(expandRunsWithCircleNodes(rectRuns));
}
