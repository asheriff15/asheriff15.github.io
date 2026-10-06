// The diagonal red / white / charcoal bands from the title slide of the Email Security deck.
export default function Stripes() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="pointer-events-none absolute -left-10 -top-10 w-[240px] sm:w-[320px] xl:w-[400px] opacity-90"
    >
      <polygon points="0,170 170,0 330,0 0,330" fill="#141419" />
      <polygon points="0,90 90,0 200,0 0,200" fill="#d00000" />
      <polygon points="0,200 200,0 232,0 0,232" fill="#ffffff" />
    </svg>
  );
}
