/** Pill badge — reuses the .ba/.ba.<tone> utility classes. */
export default function Badge({ tone = 'gry', children }) {
  return <span className={`ba ${tone}`}>{children}</span>;
}
