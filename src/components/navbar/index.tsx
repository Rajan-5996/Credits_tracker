import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/currentUserContext";

const NavBar = () => {
    const userContext = useContext(UserContext);
    const displayName = userContext?.currentUser?.trim() || "Analyst";
    const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                return;
            }

            await document.exitFullscreen();
        } catch (error) {
            console.error("Unable to toggle fullscreen mode", error);
        }
    };

    return (
        <header className="sticky top-0 z-30 w-full border-b border-amber-100 bg-linear-to-r from-white via-amber-50/70 to-orange-50/70 backdrop-blur">
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                        <GiReceiveMoney size={20} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Credits Tracker</h1>
                        <p className="hidden text-xs text-slate-500 sm:block">Monitor usage, and domain burn rate</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="grid h-9 w-9 cursor-pointer place-items-center rounded border border-amber-100 bg-white text-slate-600 shadow-sm transition hover:bg-amber-50 hover:text-slate-900"
                    >
                        {isFullscreen ? <TbArrowsMinimize size={18} /> : <TbArrowsMaximize size={18} />}
                    </button>

                    <button
                        type="button"
                        className="hidden items-center gap-2 rounded border border-amber-100 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-amber-50 sm:flex"
                    >
                        <img src={userContext?.avatarKey} alt={displayName} className="h-6 w-6 rounded" />
                        <span>{displayName}</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
