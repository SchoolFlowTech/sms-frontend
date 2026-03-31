// "use client";
import { redirect } from "next/navigation";
// Ensure recharts is installed: npm install recharts
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, GraduationCap, DollarSign, Calendar, Users, Zap } from "lucide-react";

// Dummy Data for Charts
const chartData = [
  { name: 'Mon', active: 2000 },
  { name: 'Tue', active: 3800 },
  { name: 'Wed', active: 5500 }, // Peak attendance
  { name: 'Thu', active: 4000 },
  { name: 'Fri', active: 3000 },
  { name: 'Sat', active: 2500 },
  { name: 'Sun', active: 2200 },
];

// Reusable Stat Card matching the Kleon style
const KleonStatCard = ({ title, value, icon: Icon, trend, color, accentColor }: any) => (
  <div className="flex-1 bg-white mt-5 p-6 rounded-3xl shadow-sm flex flex-col justify-center relative overflow-hidden border border-gray-100">
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

// export default function Dashboard() {
//   return (
//    <></>
//   );
// }


export default function Home() {
  redirect("/login");
}

