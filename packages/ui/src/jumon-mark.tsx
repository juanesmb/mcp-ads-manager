type Props = {
  width?: number;
  height?: number;
};

/** Jumon logo mark — fern node connected by moss lines to three ember circles */
export function JumonMark({ width = 36, height = 20 }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 36 20" role="img" aria-hidden>
      <circle cx="5" cy="10" r="4" fill="#4AB89A" />
      <line x1="9" y1="10" x2="18" y2="3"  stroke="#2A7A5C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="10" x2="18" y2="10" stroke="#2A7A5C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="10" x2="18" y2="17" stroke="#2A7A5C" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21" cy="3"  r="3" fill="#C8601A" />
      <circle cx="21" cy="10" r="3" fill="#C8601A" />
      <circle cx="21" cy="17" r="3" fill="#C8601A" />
    </svg>
  );
}
