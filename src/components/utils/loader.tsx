const keyframes = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const shimmer = {
    background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s infinite",
};

const box = (extra = {}) => ({
    ...shimmer,
    borderRadius: 8,
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
                    border: "1px solid #e4e4e4",
                    overflow: "hidden",
                    background: "#fff",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                        borderBottom: "1px solid #e4e4e4",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={box({ width: 36, height: 36, borderRadius: 8 })} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={box({ width: 120, height: 12 })} />
                            <div style={box({ width: 180, height: 10 })} />
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={box({ width: 28, height: 28, borderRadius: 6 })} />
                        <div style={circle(32)} />
                        <div style={box({ width: 90, height: 12 })} />
                    </div>
                </div>

                <div
                    style={{
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={box({ flex: 1, height: 200 })} />
                        <div style={box({ flex: 1, height: 200 })} />
                        <div style={box({ flex: 1, height: 200 })} />
                    </div>
                    <div style={box({ width: "100%", height: 200 })} />
                    <div style={box({ width: "100%", height: 300 })} />
                </div>
            </div>
        </>
    );
}