interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Text with a subtle RGB-split glitch effect on hover.
 */
export default function GlitchText({ text, className, style }: GlitchTextProps) {
  return (
    <span className={`glitch ${className ?? ""}`} style={style} data-text={text}>
      {text}
    </span>
  );
}
