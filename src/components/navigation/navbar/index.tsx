import { TbArrowsMaximize, TbArrowsMinimize } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/currentUserContext";
import { GiFastBackwardButton } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const userContext = useContext(UserContext);
    const location = globalThis?.window?.location;
    const navigate = useNavigate();
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
                const elem = document.documentElement as HTMLElement & {
                    mozRequestFullScreen?: () => Promise<void>;
                    webkitRequestFullscreen?: () => Promise<void>;
                    msRequestFullscreen?: () => Promise<void>;
                };
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
                return;
            }

            const doc = document as Document & {
                mozCancelFullScreen?: () => Promise<void>;
                webkitExitFullscreen?: () => Promise<void>;
                msExitFullscreen?: () => Promise<void>;
            };
            if (doc.exitFullscreen) {
                await doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
                await doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) {
                await doc.msExitFullscreen();
            }
        } catch (error) {
            console.error("Unable to toggle fullscreen mode", error);
        }
    };

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-b-[#1a232e] bg-[#232f3e] shadow-sm">
            <nav className="flex h-14 w-full items-center justify-between px-4">
                <div className="flex justify-center items-center gap-4">
                    {
                        location?.pathname !== "/" && (
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 group hover:bg-[#2a384a] px-2 py-1 rounded text-[#aab7c4] hover:text-white transition-colors duration-200">
                                <GiFastBackwardButton />
                                <span className="font-medium text-xs tracking-wide">Back</span>
                            </button>
                        )
                    }
                    <div className="flex min-w-0 items-center gap-3">
                        <img
                            src="/Logo.svg"
                            alt="GWC Data.ai Logo"
                            className="object-contain brightness-0 invert opacity-90"
                            height={24}
                            width={24}
                        />
                        <div className="min-w-0 flex flex-col justify-center translate-y-0.5">
                            <h1 className="truncate text-[13px] font-bold tracking-wide text-[#f2f3f3] uppercase leading-none">
                                GWC <span className="text-[#ff9900] font-bold">Data.ai</span> Console
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-transparent text-[#aab7c4] hover:bg-[#2a384a] hover:text-white transition-colors"
                    >
                        {isFullscreen ? <TbArrowsMinimize size={18} /> : <TbArrowsMaximize size={18} />}
                    </button>

                    <button
                        type="button"
                        className="hidden items-center gap-2 rounded bg-transparent hover:bg-[#2a384a] px-2 py-1.5 text-xs font-semibold text-[#f2f3f3] transition-colors sm:flex"
                    >
                        <div className="relative">
                            <img src={userContext?.avatarKey} alt={displayName} className="h-6 w-6 rounded bg-[#232f3e]" />
                            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-[#232f3e]" />
                        </div>
                        <span>{displayName}</span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;

