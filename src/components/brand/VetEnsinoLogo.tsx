type VetEnsinoLogoProps = {
  compact?: boolean;
  light?: boolean;
  showTagline?: boolean;
};

export const VetEnsinoLogo = ({ compact = false, light = false, showTagline = false }: VetEnsinoLogoProps) => {
  const textSize = compact ? 'clamp(1.4rem, 2vw, 2.2rem)' : 'clamp(2.1rem, 4vw, 4.6rem)';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 0,
          fontWeight: 800,
          letterSpacing: '-0.08em',
          lineHeight: 0.9,
          fontSize: textSize,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          userSelect: 'none',
        }}
      >
        <span style={{ color: light ? '#f5f3f7' : '#5d3eaa' }}>VET</span>
        <span style={{ color: light ? '#f4bf3d' : '#f4bf3d', marginLeft: '0.06em' }}>ENSINO</span>
      </div>

      {showTagline && (
        <div
          style={{
            marginTop: 8,
            width: compact ? 120 : 170,
            height: 6,
            borderRadius: 999,
            background: '#f4bf3d',
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

export default VetEnsinoLogo;
