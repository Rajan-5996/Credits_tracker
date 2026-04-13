const SkeletonLoader = () => {
    return (
        <div className="min-h-screen w-full bg-background overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />

            {/* Nav Skeleton */}
            <div className="h-20 w-full border-b border-primary/5 bg-white/50 backdrop-blur-3xl flex items-center justify-between px-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
                    <div className="space-y-2">
                        <div className="w-32 h-3 bg-primary/10 rounded-full animate-pulse" />
                        <div className="w-20 h-2 bg-primary/5 rounded-full animate-pulse" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/5 animate-pulse" />
                    <div className="w-24 h-10 rounded-full bg-primary/5 animate-pulse" />
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto p-10 space-y-10">
                {/* Header Strip */}
                <div className="flex justify-between items-end">
                    <div className="space-y-3">
                        <div className="w-64 h-8 bg-primary/10 rounded-lg animate-pulse" />
                        <div className="w-40 h-3 bg-primary/5 rounded-full animate-pulse" />
                    </div>
                    <div className="w-72 h-10 bg-primary/5 rounded-full animate-pulse" />
                </div>

                {/* KPI Grid Skeleton */}
                <div className="grid grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-56 glass-console rounded-[2rem] border-none p-8 space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
                            <div className="space-y-2 pt-2">
                                <div className="w-full h-3 bg-primary/5 rounded-full animate-pulse" />
                                <div className="w-1/2 h-8 bg-primary/10 rounded-lg animate-pulse" />
                                <div className="w-2/3 h-2 bg-primary/5 rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Network Skeleton */}
                <div className="w-full h-[600px] glass-console rounded-[3rem] border-none p-10 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 animate-pulse" />
                            <div className="space-y-2">
                                <div className="w-48 h-6 bg-primary/10 rounded-lg animate-pulse" />
                                <div className="w-32 h-2 bg-primary/5 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-primary/5 rounded-[2rem] animate-pulse" />
                </div>

                {/* Registry Header */}
                <div className="flex justify-between px-4">
                    <div className="w-40 h-5 bg-primary/10 rounded-full animate-pulse" />
                    <div className="w-32 h-8 bg-primary/10 rounded-full animate-pulse" />
                </div>

                {/* Registry Table Skeleton */}
                <div className="w-full h-80 glass-console rounded-[2rem] border-none p-4 opacity-50">
                    <div className="w-full h-full bg-primary/5 rounded-[1.5rem] animate-pulse" />
                </div>
            </main>
        </div>
    );
};

export default SkeletonLoader;
