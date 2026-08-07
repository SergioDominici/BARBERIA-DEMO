export default function Seal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ fontFamily: "var(--font-heading)" }}
      aria-hidden
    >
      <defs>
        <path id="seal-top" d="M 34 100 A 66 66 0 0 1 166 100" />
        <path id="seal-bot" d="M 34 100 A 66 66 0 0 0 166 100" />
      </defs>

      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" />

      <text
        fill="currentColor"
        fontSize="17"
        fontWeight="700"
        letterSpacing="3"
        textAnchor="middle"
      >
        <textPath href="#seal-top" startOffset="50%">
          NAVAJA &amp; CO.
        </textPath>
      </text>
      <text
        fill="currentColor"
        fontSize="13"
        fontWeight="600"
        letterSpacing="4"
        textAnchor="middle"
      >
        <textPath href="#seal-bot" startOffset="50%">
          BARBERÍA · BOGOTÁ
        </textPath>
      </text>

      {/* Centro */}
      <text
        x="100"
        y="88"
        fill="currentColor"
        fontSize="13"
        fontWeight="600"
        letterSpacing="2"
        textAnchor="middle"
      >
        EST.
      </text>
      <text
        x="100"
        y="118"
        fill="currentColor"
        fontSize="30"
        fontWeight="700"
        textAnchor="middle"
      >
        2009
      </text>
      <text x="72" y="105" fill="currentColor" fontSize="16" textAnchor="middle">
        ★
      </text>
      <text x="128" y="105" fill="currentColor" fontSize="16" textAnchor="middle">
        ★
      </text>
    </svg>
  );
}
