const keyframes = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const shimmer = {
    background: "linear-gradient(90deg, rgba(112,48,177,0.05) 25%, rgba(112,48,177,0.1) 50%, rgba(112,48,177,0.05) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s infinite linear",
};

const box = (extra = {}) => ({
    ...shimmer,
    borderRadius: 12,
    ...extra,
});

const circle = (size: number) => ({
    ...shimmer,
    borderRadius: "50%",
    width: size,
    height: size,
    flexShrink: 0,
});

export default function SkeletonLoader() {
    return (
        <>
            <style>{keyframes}</style>
            <div
                style={{
                    background: "#fdfbff",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Montserrat', sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(112,48,177,0.1)",
                        background: "white",
                        maxWidth: "1580px",
                        margin: "0 auto",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={box({ width: 35, height: 35, borderRadius: 8 })} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={box({ width: 140, height: 14 })} />
                            <div style={box({ width: 200, height: 10 })} />
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={box({ width: 36, height: 36, borderRadius: 10 })} />
                        <div style={circle(40)} />
                    </div>
                </div>

                <div
                    style={{
                        padding: "16px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        maxWidth: "1580px",
                        margin: "0 auto",
                        width: "100%",
                    }}
                >
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={box({ flex: 1, height: 256, borderRadius: 24 })} />
                        <div style={box({ flex: 1, height: 256, borderRadius: 24 })} />
                        <div style={box({ flex: 1, height: 256, borderRadius: 24 })} />
                    </div>
                    <div style={box({ width: "100%", height: 720, borderRadius: 24, marginTop: 12 })} />
                    <div style={box({ width: "100%", height: 64, borderRadius: 12, marginTop: 12 })} />
                    <div style={box({ width: "100%", height: 520, borderRadius: 24, marginTop: 12 })} />
                </div>
            </div>
        </>
    );
}
