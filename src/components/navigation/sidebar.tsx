import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  TbLayoutDashboard,
  TbUsers,
  TbSettings,
  TbChartDots3,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";
import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: TbLayoutDashboard },
    { name: "Users Analytics", path: "/users", icon: TbUsers },
    { name: "Global Metrics", path: "/metrics", icon: TbChartDots3 },
    { name: "Settings", path: "/settings", icon: TbSettings },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative hidden md:flex flex-col h-screen bg-white/40 backdrop-blur-2xl border-r border-white/40 shadow-2xl z-50 overflow-visible"
    >
      <div className="flex items-center justify-between p-6 h-20 border-b border-white/20">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <span className="text-lg font-black tracking-tight text-foreground">
              Credits Tracker
            </span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hover:bg-white/60 text-foreground/70 hover:text-primary transition-all ${collapsed ? "mx-auto" : ""}`}
        >
          <TbLayoutSidebarLeftCollapse className={`text-xl ${collapsed ? "rotate-180" : ""} transition-transform duration-300`} />
        </button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center ${collapsed ? "justify-center px-0" : "px-4"} py-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-white/80 shadow-md border border-white/50 text-primary" 
                    : "hover:bg-white/50 text-foreground/70 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-gradient rounded-r-full shadow-[0_0_10px_rgba(112,48,177,0.5)]" 
                  />
                )}
                
                <item.icon className={`text-2xl min-w-8 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                
                {!collapsed && (
                  <span className={`font-semibold ml-3 ${isActive ? 'text-foreground tracking-tight' : 'font-medium'}`}>
                    {item.name}
                  </span>
                )}
                
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-sm font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.name}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/20 mt-auto">
        {!collapsed ? (
          <div className="p-4 rounded-2xl bg-brand-gradient shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-white font-bold mb-1 text-sm">Need Help?</h4>
            <p className="text-white/80 text-xs mb-3 font-medium">Check our documentation or contact support.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition-colors border border-white/10">
              Support Center
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-brand-gradient flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all">
             <span className="text-white font-bold">?</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
