// app/(protected)/layout.tsx
"use client";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Settings,
  Bell,
  LogOut,
  Search,
  Mail,
  ArrowUpCircle, // For the Upgrade button
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Assuming you have Redux set up, but relying primarily on localStorage for token check

// --- 🅰️ SidebarItem Component (Moved here for simplicity) ---
// We need the pathname here to correctly set the active state
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Teachers", icon: LayoutDashboard, path: "/teachers" },
  { name: "Students", icon: User, path: "/students" },
  { name: "Courses", icon: BookOpen, path: "/courses" },
  { name: "Messages", icon: Mail, path: "/messages", badge: "3" },
];

function SidebarItem({ icon: Icon, label, path, badge, currentPath }: any) {
  // Fix 1: Dynamically check the active path
  const isActive = currentPath.startsWith(path);

  return (
    <Link
      href={path}
      className={`flex items-center justify-between px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 group ${
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/30"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-5 h-5 ${
            isActive ? "text-white" : "text-primary/70 group-hover:text-primary"
          }`}
        />
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
}
// -----------------------------------------------------------

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  // Fix 2: State to hold the user's name
  const [userName, setUserName] = useState<string>("");

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const user = localStorage.getItem("user");

  //   if (!token) {
  //     // Redirects unauthenticated users to login
  //     router.replace("/login");
  //   } else {
  //     if (user) {
  //       const parsed = JSON.parse(user);
  //       // Set the user name from localStorage
  //       console.log("user is here",user)
  //       setUserName(parsed?.name || "Admin");
  //     }
  //     setLoading(false);
  //   }
  // }, [router]);

  // if (loading) {
  //   // Show nothing while checking auth to prevent flashing content
  //   return null;
  // }

const handleLogout = async () => {
  try {
    await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 REQUIRED so backend can clear cookie
      body: JSON.stringify({
        query: `mutation { logout }`,
      }),
    });
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    // just redirect — cookie is already cleared by backend
    router.replace("/login");
  }
};


  return (
    <div className="flex min-h-screen font-sans bg-[var(--color-background-page)]">
      {/* SIDEBAR - Kleon Styling */}
      <aside className="w-72 hidden md:flex flex-col bg-white m-4 rounded-[30px] shadow-soft h-[calc(100vh-2rem)] sticky top-4 flex-shrink-0">
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            AJ
          </div>
          <span className="text-2xl font-bold text-gray-900">
            AJ Techno<span className="text-primary">.</span>
          </span>
        </div>

        {/* Dynamic Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.name}
              path={item.path}
              badge={item.badge}
              currentPath={pathname} // Pass current path for dynamic active state
            />
          ))}

          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-2">
            System
          </p>
          {/* Settings Item */}
          <SidebarItem
            icon={Settings}
            label="Settings"
            path="/settings"
            currentPath={pathname}
          />
        </nav>

        {/* PRO + LOGOUT Section */}
        <div className="p-6 space-y-3">
          <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/30">
            <p className="text-sm font-medium opacity-90">Pro Plan</p>
            <p className="text-xs opacity-70 mb-4">Expires in 30 days</p>
            <button className="w-full bg-white text-primary py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
               <ArrowUpCircle className="w-4 h-4" />
              Upgrade
            </button>
          </div>

          {/* 🔥 Logout Button - Thematic Red */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 p-4 md:p-8  ">
        {/* HEADER - Sticky and Styled */}
        <header className="flex  justify-between items-center mb-3 bg-white p-4 rounded-3xl  top-8 z-50 shadow-sm border border-gray-100/50">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search here..."
              // Adjusted width for better responsiveness on smaller desktops
              className="pl-12 pr-4 py-3 bg-[#F4F7FE] rounded-full text-sm w-full sm:w-80 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* User Info & Notifications */}
          <div className="flex items-center gap-4">
            {/* Fix 3: Display user name */}
            <p className="text-sm font-bold text-gray-700 hidden sm:block">
              👋 Hello, {userName || "Admin"}
            </p>
            
            {/* Notification Bell */}
            <button className="p-3 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary transition-colors relative border border-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            {/* User Avatar - Franklin Jr. style */}
            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-primary overflow-hidden hidden sm:block">
                {/* Dummy Avatar */}
                <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}