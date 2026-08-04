type LoaderProps = {
  /** Visible loading text (also used for screen readers). */
  label?: string;
  className?: string;
};

/**
 * Glitchy “Loading…” mask animation.
 * CSS lives in globals.css under `.dropx-loader`.
 */
export default function Loader({
  label = "Loading...",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`dropx-loader ${className}`.trim()}
      data-label={label}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}
