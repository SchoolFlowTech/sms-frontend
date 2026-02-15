"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Banknote,
  CalendarDays,
  Settings,
  LogOut,
  ArrowUpCircle, // Icon for the Upgrade button
} from "lucide-react";

const menuItems = [
  // Renamed paths for simplicity, adjust as needed
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Students", icon: Users, path: "/students" },
  { name: "Teachers", icon: GraduationCap, path: "/teachers" },
  { name: "Courses", icon: Banknote, path: "/courses" },
  { name: "Schedule", icon: CalendarDays, path: "/schedule" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // Main Container: Floating Card Look
    <aside className="w-72 hidden md:flex flex-col bg-white m-4 rounded-[30px] shadow-soft h-[calc(100vh-2rem)] sticky top-4 flex-shrink-0">
      
      {/* 1. Logo Area - Exact Kleon Style */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
          AJ
        </div>
        <span className="text-2xl font-bold text-gray-900">AJ Techno<span className="text-primary">.</span></span>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Check if the current path starts with the item's path (e.g., /students/profile)
            const isActive = pathname.startsWith(item.path); 

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  // Item Styling: Heavy padding and rounded-xl for the Kleon look
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 text-sm font-semibold cursor-pointer group ${
                    isActive
                      // Active state: White text, primary purple background, with shadow
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      // Inactive state: Gray text, hover to primary color
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive 
                        ? "text-white" 
                        : "text-primary/70 group-hover:text-primary" // Use primary/70 for inactive icons
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. System Menu (Settings and Logout) */}
      <div className="px-4 py-4 space-y-1 border-t border-gray-100/70">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System</p>
        
        {/* Settings Item */}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-5 py-3 rounded-xl transition-colors text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 text-primary/70" />
          Settings
        </Link>
        
        {/* Logout Button */}
        <button
          className="flex items-center gap-3 w-full px-5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          Logout
        </button>
      </div>
      
      {/* 4. Pro Plan Card (Kleon visual element) */}
      <div className="p-4">
        <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/30">
          <p className="text-sm font-medium opacity-90">Pro Plan</p>
          <p className="text-xs opacity-70 mb-4">Expires in 30 days</p>
          <button className="w-full bg-white text-primary py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <ArrowUpCircle className="w-4 h-4" />
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}