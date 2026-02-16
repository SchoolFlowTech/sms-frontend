"use client";

import React, { useMemo, useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast/headless";

type Employee = {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
    mobileNumber: string;
    status: string;
};

export default function EmployeesPage() {
    const router = useRouter();
    const pageSize = 10;

    const [page, setPage] = useState(1);

    // ✅ Dummy Data
    const [employees] = useState<Employee[]>([
        {
            id: 1,
            firstName: "Ali",
            lastName: "Husain",
            role: "Teacher",
            department: "Science",
            mobileNumber: "9876543210",
            status: "Active",
        },
        {
            id: 2,
            firstName: "Junaid",
            lastName: "Khan",
            role: "Accountant",
            department: "Finance",
            mobileNumber: "9123456780",
            status: "Inactive",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Simple Search Filter
    const filteredEmployees = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return employees;

        return employees.filter((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            const role = emp.role.toLowerCase();
            const department = emp.department.toLowerCase();
            const mobile = emp.mobileNumber.toLowerCase();
            const status = emp.status.toLowerCase();

            return (
                fullName.includes(term) ||
                role.includes(term) ||
                department.includes(term) ||
                mobile.includes(term) ||
                status.includes(term)
            );
        });
    }, [employees, searchTerm]);


    const total = filteredEmployees.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    const showingFrom = total === 0 ? 0 : startIndex + 1;
    const showingTo = Math.min(endIndex, total);




    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Employees Directory
                </h1>

                <button
                    onClick={() => router.push("/employees/new")}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>
            

            {/* Filters & Search Bar */}
                  <div className="bg-white p-4 mb-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, ID, qualification, or experience..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                        onClick={() => toast("Filters coming soon 😄")}
                      >
                        <Filter className="w-4 h-4" /> Filters
                      </button>
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                        onClick={() => {
                          if (!filteredEmployees.length) {
                            toast.error("No employees to export");
                            return;
                          }
                          const headers = [
                            "employeeId",
                            "firstName",
                            "lastName",
                            "qualification",
                            "experience",
                            "mobileNumber",
                            "status",
                          ];
                          const rows = filteredEmployees.map((t) =>
                            headers
                              .map((h) =>
                                `"${String((t as any)[h] ?? "")
                                  .replace(/"/g, '""')}"`
                              )
                              .join(",")
                          );
                          const csv = [headers.join(","), ...rows].join("\n");
                          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "teachers.csv";
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

            {/* Search */}
            {/* <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div> */}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                        <tr>
                            <th className="py-4 px-6">Employee</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Department</th>
                            <th className="py-4 px-6">Contact</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredEmployees.map((emp) => {
                            const isActive =
                                emp.status.toLowerCase() === "active";

                            return (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-gray-900">
                                        {emp.firstName} {emp.lastName}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {emp.role}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {emp.department}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {emp.mobileNumber}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                                            onClick={() =>
                                                router.push(
                                                    `/employees/${emp.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Showing {showingFrom}-{showingTo} of {total}
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                            disabled={currentPage === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                            disabled={currentPage === totalPages || total === 0}
                            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
