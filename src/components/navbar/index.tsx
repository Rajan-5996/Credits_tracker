import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";
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
        <header className="sticky top-0 z-[100] w-full border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm">
            <nav className="mx-auto flex h-18 w-full max-w-[1580px] items-center justify-between px-1 sm:px-2">
                <div className="flex min-w-0 items-center gap-4">
                    <img
                        src="Logo.svg"
                        alt="GWC Data.ai Logo"
                        className="h object-contain"
                        height={35}
                        width={35}
                    />
                    <div className="min-w-0 flex flex-col">
                        <h1 className="truncate text-lg font-black tracking-tighter text-foreground sm:text-xl uppercase leading-none">
                            GWC <span className="text-primary font-black">Data.ai</span>
                        </h1>
                        <a
                            href="https://gwcteq-partner.domo.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden text-[9px] font-bold text-primary/60 hover:text-primary sm:block tracking-wide truncate transition-colors decoration-primary underline-offset-2"
                        >
                            gwcteq-partner.domo.com
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-all hover:bg-secondary hover:text-primary active:scale-90"
                    >
                        {isFullscreen ? <TbArrowsMinimize size={20} /> : <TbArrowsMaximize size={20} />}
                    </button>

                    <button
                        type="button"
                        className="hidden items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-secondary hover:border-primary/20 sm:flex group"
                    >
                        <div className="relative">
                            <img src={userContext?.avatarKey} alt={displayName} className="h-6.5 w-6.5 rounded-lg border border-primary/20" />
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                        </div>
                        <span className="group-hover:text-primary transition-colors">{displayName}</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
