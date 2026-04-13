import { TbArrowsMaximize, TbArrowsMinimize, TbChevronLeft } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/currentUserContext";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const displayName = userContext?.currentUser?.trim() || "Analyst";
    const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    const handleNavClick = (sectionId?: string) => {
        if (location.pathname !== "/") {
            navigate("/");
            if (sectionId) {
                setTimeout(() => {
                    const el = document.getElementById(sectionId);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        setActiveSection(sectionId);
                    }
                }, 200);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveSection("");
            }
        } else if (sectionId) {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                setActiveSection(sectionId);
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("");
        }
    };

    const navItems = [
        { name: "Dashboard", id: "" },
        { name: "Topology", id: "topology" },
        { name: "Registry", id: "registry" },
    ];

    const isUserPage = location.pathname.startsWith('/user/');

    return (
        <header className="sticky top-0 z-[100] w-full bg-white border-b border-primary/5 shadow-xl h-20 overflow-hidden">
            {/* Top Branding Strip */}
            <div className="h-1 w-full gwc-gradient" />
            
            <nav className="flex h-full w-full max-w-[1800px] mx-auto items-center justify-between px-4 md:px-10 lg:px-12">
                {/* Brand & Scrollable Nav on Mobile */}
                <div className="flex items-center gap-4 md:gap-10 min-w-0 flex-1">
                    {isUserPage && (
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all border border-primary/10 shrink-0"
                        >
                            <TbChevronLeft size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0" onClick={() => handleNavClick()}>
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl gwc-gradient p-2 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <img
                                src="/Logo.svg"
                                alt="GWC"
                                className="object-contain brightness-0 invert"
                                height={22}
                                width={22}
                            />
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                            <h1 className="text-sm md:text-lg font-black tracking-tight text-foreground capitalize font-heading leading-tight">
                                GWC <span className="gwc-text-gradient italic font-black">Data.ai</span>
                            </h1>
                            <p className="text-[8px] md:text-[9px] font-black text-primary capitalize tracking-[0.2em] leading-none mt-1">Intelligence console</p>
                        </div>
                    </div>

                    {/* Scrollable Nav Container */}
                    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide py-1 px-1 mask-linear-right md:mask-none">
                        {navItems.map((item) => {
                            const isActive = (item.id === "" && activeSection === "" && location.pathname === "/") || 
                                           (item.id !== "" && activeSection === item.id);
                            return (
                                <button 
                                    key={item.name} 
                                    onClick={() => handleNavClick(item.id)}
                                    className={`
                                        px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black capitalize tracking-widest transition-all duration-300 whitespace-nowrap
                                        ${isActive 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"}
                                    `}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-5 shrink-0 ml-4">
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="hidden sm:flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all border border-primary/10"
                    >
                        {isFullscreen ? <TbArrowsMinimize size={16} /> : <TbArrowsMaximize size={16} />}
                    </button>

                    <div className="hidden md:block h-8 w-px bg-primary/10 mx-1" />

                    <button
                        type="button"
                        className="flex items-center gap-2 md:gap-3 rounded-full bg-secondary/80 hover:bg-secondary pl-1 pr-3 md:pr-4 py-1 border border-primary/5 transition-all group"
                    >
                        <div className="relative">
                            <img 
                                src={userContext?.avatarKey} 
                                alt={displayName} 
                                className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white border border-primary/20 group-hover:border-primary transition-colors object-cover" 
                            />
                            <div className="absolute bottom-0 right-0 h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                        </div>
                        <div className="text-left hidden lg:block">
                            <p className="text-[10px] font-black text-foreground font-heading capitalize leading-none">{displayName}</p>
                            <p className="text-[8px] font-black text-primary capitalize tracking-widest mt-0.5 opacity-60">Manager</p>
                        </div>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
