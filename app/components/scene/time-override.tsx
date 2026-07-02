"use client";

import { SEGMENT_ORDER, SEGMENTS, type TimeSegmentId } from "@/lib/timeSegments";

const GLYPHS: Record<TimeSegmentId, string> = {
  dawn: "◗",
  day: "●",
  afternoon: "◖",
  night: "☾",
  latenight: "✦",
};

/**
 * Manual time-of-day preview: five segment dots + an "Auto" reset that
 * follows the visitor's real clock (the default). Radio semantics so it is
 * natively keyboard operable.
 */
export function TimeOverride({
  override,
  onChange,
}: {
  override: TimeSegmentId | null;
  onChange: (next: TimeSegmentId | null) => void;
}) {
  return (
    <div className="scene-time" role="radiogroup" aria-label="Preview a time of day">
      {SEGMENT_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={override === id}
          aria-label={`Preview ${SEGMENTS[id].label}`}
          title={SEGMENTS[id].label}
          className="scene-time__dot"
          data-active={override === id || undefined}
          onClick={() => onChange(id)}
        >
          <span aria-hidden>{GLYPHS[id]}</span>
        </button>
      ))}
      <button
        type="button"
        role="radio"
        aria-checked={override === null}
        className="scene-time__auto mono"
        data-active={override === null || undefined}
        onClick={() => onChange(null)}
        title="Follow your local time"
      >
        auto
      </button>
    </div>
  );
}
