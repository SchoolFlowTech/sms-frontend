"use client"

// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import dynamic from "next/dynamic";

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

import { ArrowUpRight, GraduationCap, DollarSign, Calendar, Users, Zap } from "lucide-react";
const KleonStatCard = ({ title, value, icon: Icon, trend, color, accentColor }: any) => (
  <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-center relative overflow-hidden border border-gray-100">
    <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon className={`w-20 h-20 sm:w-24 sm:h-24 ${accentColor}`} />
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${color} shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 text-gray-900">{value}</h3>
    <p className="text-green-500 text-sm font-bold mt-2 flex items-center gap-1">
        <ArrowUpRight className="w-4 h-4" /> {trend}
    </p>
  </div>
);
export default function DashboardPage() {
  const chartData = [
  { name: 'Mon', active: 2000 },
  { name: 'Tue', active: 3800 },
  { name: 'Wed', active: 5500 }, // Peak attendance
  { name: 'Thu', active: 4000 },
  { name: 'Fri', active: 3000 },
  { name: 'Sat', active: 2500 },
  { name: 'Sun', active: 2200 },
];
  return (
    
    <div className="text-gray-800">
 <div className="space-y-6 sm:space-y-8">
      
      {/* 1. KEY ANALYTICS SECTION - Adjusted Grid for Mobile */}
      {/* Changed to grid-cols-1 first, then md:grid-cols-12 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Chart Card - Takes full width on mobile/tablet */}
        <div className="md:col-span-8 bg-white p-4 sm:p-8 rounded-4xl shadow-soft border border-gray-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
            <div>
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Analytics</h2>
               <p className="text-sm text-gray-500 mt-1">Comparison of student presence vs absence</p>
            </div>
            <select className="mt-3 sm:mt-0 bg-[var(--color-background-page)] text-gray-600 text-sm font-semibold py-2 px-4 rounded-xl outline-none border border-gray-200">
                <option>Weekly</option>
                <option>Monthly</option>
            </select>
          </div>
          
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {/* Responsive XAxis: Hide labels on small phones, show on medium screens */}
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12}} dy={10} />
                <YAxis hide={true} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="active" stroke="#5D5FEF" strokeWidth={4} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Side Stats - Changed to grid-cols-2 on mobile, then flex-col on md screens */}
        <div className="md:col-span-4 grid grid-cols-2 gap-4 md:gap-6 md:flex md:flex-col">
            <KleonStatCard
                title="Total Students" 
                value="892" 
                trend="+12.5% vs last month" 
                icon={Users} 
                color="bg-primary"
                accentColor="text-primary/70"
            />
            
            {/* Fees Collected Card - Direct Kleon Look */}
            <div className="flex-1 bg-primary p-4 sm:p-6 rounded-3xl shadow-soft text-white flex flex-col justify-center">
                 <p className="text-white/80 font-medium text-xs sm:text-sm">Fees Collected</p>
                 <h3 className="text-2xl sm:text-4xl font-extrabold mt-1">$45,231</h3>
                 <div className="mt-3 sm:mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[70%] rounded-full"></div>
                 </div>
                 <p className="text-xs text-white/70 mt-2">70% of goal reached</p>
            </div>
        </div>
      </div>
      
      {/* 2. PROGRESS AND SCHEDULE SECTION - Changed to grid-cols-1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Class Progress */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-6">Class Progress</h3>
            <div className="space-y-6">
                {['Mathematics', 'Science', 'History', 'Art'].map((subject, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                            <span>{subject}</span>
                            <span>{80 - (i * 10)}%</span>
                        </div>
                        <div className="w-full bg-[#F4F7FE] h-3 rounded-full">
                            <div 
                                className={`h-full rounded-full bg-primary`} 
                                style={{ width: `${80 - (i * 10)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Schedule Widget */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-0">Today's Schedule</h3>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl text-sm font-semibold text-primary cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    <span>Oct 24, 2025</span>
                </div>
            </div>
            <div className="space-y-4">
                {[
                    { time: '09:00 AM', title: 'Advanced Algebra', teacher: 'Mr. Anderson' },
                    { time: '11:00 AM', title: 'Physics Lab', teacher: 'Ms. Carter' },
                    { time: '02:00 PM', title: 'World History', teacher: 'Dr. Lee' },
                ].map((item, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{item.time}</span>
                        <h4 className="font-bold text-gray-800 mt-2">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Room 4-B • {item.teacher}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}
