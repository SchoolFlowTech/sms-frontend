"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosClient from "../../lib/axiosClient.js";
const STUDENTS_QUERY = `
  query Students {
    students {
      status
      message
      data {
        studentId
        firstName
        lastName
        gender
        dateOfBirth
        mobileNumber
        address
        className
        section
        rollNumber
        admissionDate
        status
      }
    }
  }
`;

type Student = {
  studentId: number;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  address?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  admissionDate?: string;
  status?: string; // Active / Inactive / etc.
};

export default function StudentsPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10;

 async function fetchStudents() {
  try {
    setLoading(true);

    const res = await axiosClient.post("/", {
      query: STUDENTS_QUERY,
    });

    // GraphQL errors (200 OK but failed)
    if (res.data.errors) {
      throw new Error(
        res.data.errors[0]?.message || "Failed to fetch students"
      );
    }

    const list: Student[] = res.data?.data?.students?.data ?? [];
    setStudents(list);
  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Failed to load students");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchStudents();
  }, []);

  // filter + paginate on client
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return students;

    return students.filter((s) => {
      const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`
        .toLowerCase()
        .trim();
      const id = String(s.studentId ?? "").toLowerCase();
      const roll = (s.rollNumber ?? "").toLowerCase();
      const cls = (s.className ?? "").toLowerCase();
      const section = (s.section ?? "").toLowerCase();
      const mobile = (s.mobileNumber ?? "").toLowerCase();

      return (
        fullName.includes(term) ||
        id.includes(term) ||
        roll.includes(term) ||
        `${cls} ${section}`.includes(term) ||
        mobile.includes(term)
      );
    });
  }, [students, searchTerm]);

  const total = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, total);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students Directory</h1>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          onClick={() => {
            router.push("/students/new");
          }}
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 mb-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, roll, or class..."
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
              if (!students.length) {
                toast.error("No students to export");
                return;
              }
              const headers = [
                "studentId",
                "firstName",
                "lastName",
                "className",
                "section",
                "rollNumber",
                "mobileNumber",
                "status",
              ];
              const rows = students.map((s) =>
                headers
                  .map((h) =>
                    `"${String((s as any)[h] ?? "")
                      .replace(/"/g, '""')}"`
                  )
                  .join(",")
              );
              const csv = [headers.join(","), ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "students.csv";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
            <tr>
              <th className="py-4 px-6">Student Info</th>
              <th className="py-4 px-6">Class</th>
              <th className="py-4 px-6">Parent Contact</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 px-6 text-center text-gray-500">
                  Loading students…
                </td>
              </tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 px-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student, index) => {
                const fullName = `${student.firstName ?? ""} ${
                  student.lastName ?? ""
                }`.trim();

                const initials =
                  fullName
                    .split(" ")
                    .filter(Boolean)
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase() || "ST";

                const isActive =
                  String(student.status ?? "").toLowerCase() === "active";

                return (
                  <tr
                    key={student.studentId ?? index}
                    className="hover:bg-gray-50 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {fullName || "Unnamed Student"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {student.studentId ?? "—"} | Roll:{" "}
                            {student.rollNumber ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {student.className
                        ? `${student.className}${
                            student.section ? ` - Sec ${student.section}` : ""
                          }`
                        : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {student.mobileNumber ?? "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        onClick={() =>
                          router.push(
                            `/students/${student.studentId}`
                          )
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
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
