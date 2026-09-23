type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  compact?: boolean;
  align?: 'left' | 'center';
  className?: string;
};

const fontSizes = {
  sm: 'clamp(1.1rem, 2vw, 1.8rem)',
  md: 'clamp(1.7rem, 3vw, 2.7rem)',
  lg: 'clamp(2.8rem, 5vw, 5rem)',
  xl: 'clamp(4rem, 7vw, 7rem)',
} as const;

export const BrandLogo = ({
  size = 'lg',
  compact = false,
  align = 'left',
  className,
}: BrandLogoProps) => {
  const fontSize = fontSizes[size];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          gap: '0.04em',
          lineHeight: 0.85,
        }}
      >
        <span
          className={size === 'sm' ? 'brand-logo-full' : undefined}
          style={{
            display: 'inline-block',
            fontSize,
            fontWeight: 900,
            letterSpacing: '-0.08em',
            textTransform: 'uppercase',
            color: '#6E3BB3',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          VET
        </span>
        {size === 'sm' && (
          <span
            className="brand-logo-initial"
            style={{
              display: 'none',
              fontSize,
              fontWeight: 900,
              letterSpacing: '-0.08em',
              textTransform: 'uppercase',
              color: '#6E3BB3',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            V
          </span>
        )}
        <span
          className={size === 'sm' ? 'brand-logo-full' : undefined}
          style={{
            display: 'inline-block',
            fontSize,
            fontWeight: 900,
            letterSpacing: '-0.08em',
            textTransform: 'uppercase',
            color: '#F4B21A',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          ENSINO
        </span>
        {size === 'sm' && (
          <span
            className="brand-logo-initial"
            style={{
              display: 'none',
              fontSize,
              fontWeight: 900,
              letterSpacing: '-0.08em',
              textTransform: 'uppercase',
              color: '#F4B21A',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            E
          </span>
        )}
      </div>

      {!compact && (
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: size === 'xl' ? 260 : size === 'lg' ? 220 : 160,
            height: 5,
            borderRadius: 999,
            background: '#F4B21A',
            marginTop: 8,
          }}
        />
      )}
    </div>
  );
};

export default BrandLogo;
