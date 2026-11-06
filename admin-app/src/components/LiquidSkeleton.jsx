const LiquidSkeleton = ({ className = "" }) => {
    return (
        <div
            className={`
                relative overflow-hidden rounded-xl
                border border-white/70
                bg-gradient-to-br from-white/75 via-[#e1f8f3]/65 to-[#adefe7]/35
                shadow-[0_4px_18px_rgba(0,52,53,0.05)]
                backdrop-blur-2xl
                ${className}
            `}
        >
            <div className="absolute inset-0 animate-liquid-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm" />
        </div>
    );
};

export default LiquidSkeleton;