"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
import axiosClient from "../../../lib/axiosClient";
import { GET_EMPLOYEE_BY_ID_QUERY, UPDATE_EMPLOYEE_MUTATION } from "../../../gql/Employee/employee";
import { UPDATE_TEACHER_MUTATION } from "../../../gql/Teachers/teacher";

type EmployeeFormState = {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    address: string;
    salary: number;
    joiningDate: string;
    status: string;
    type: string;

    // For Teachers
    teacherId?: number;
    qualification: string;
    experience: number;
    dateOfBirth: string;
    gender: string;

    // For Admin Staff
    staffDepartment: string;

    // For Accountant
    certification: string;
    Accexperience: string;
};

const EMPTY_VALUES: EmployeeFormState = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    address: "",
    salary: 0.0,
    joiningDate: "",
    status: "Active",
    type: "Admin Staff",
    qualification: "",
    experience: 0,
    dateOfBirth: "",
    gender: "",
    staffDepartment: "",
    certification: "",
    Accexperience: "",
};

const EmployeeType = {
    ADMIN_STAFF: "ADMIN_STAFF",
    TEACHER: "TEACHER",
    ACCOUNTANT: "ACCOUNTANT",
} as const;
type EmployeeTypeType = typeof EmployeeType[keyof typeof EmployeeType];

export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const employeeIdParam = params?.employeeId as string;

    const [initialValues, setInitialValues] =
        useState<EmployeeFormState>(EMPTY_VALUES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchEmployee() {
            try {
                setLoading(true);

                if (!employeeIdParam) throw new Error("No employeeId in route");

                const res = await axiosClient.post("", {
                    query: GET_EMPLOYEE_BY_ID_QUERY,
                    variables: {
                        employeeId: Number(employeeIdParam),
                    },
                });

                // GraphQL errors (200 OK but failed)
                if (res.data.errors) {
                    throw new Error(
                        res.data.errors[0]?.message || "Failed to fetch employee details",
                    );
                }

                const employee = res?.data?.data?.employee?.data;

                if (!employee) {
                    throw new Error("Employee not found");
                }

                setInitialValues({
                    firstName: employee.firstName ?? "",
                    lastName: employee.lastName ?? "",
                    mobileNumber: employee.mobileNumber ?? "",
                    address: employee.address ?? "",
                    joiningDate: employee.joiningDate
                        ? new Date(Number(employee.joiningDate)).toISOString().split("T")[0]
                        : "",
                    qualification: employee.teacher?.qualification ?? "",
                    experience: employee.teacher?.experience ?? 0,
                    gender: employee.teacher?.gender ?? "",
                    dateOfBirth: employee.teacher?.dateOfBirth
                        ? new Date(Number(employee.teacher.dateOfBirth)).toISOString().split("T")[0]
                        : "",
                    salary: employee.salary ?? 0.0,
                    status: employee.status ?? "Active",
                    type: employee.type ?? EmployeeType.ADMIN_STAFF,
                    certification: employee.Accountant?.certification ?? "",
                    Accexperience: employee.Accountant?.Accexperience ?? "",
                    staffDepartment: employee.Admin_staff?.staffDepartment ?? "",
                });
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message || "Failed to load employee details");
            } finally {
                setLoading(false);
            }
        }

        fetchEmployee();
    }, [employeeIdParam]);

    const formik = useFormik<EmployeeFormState>({
        initialValues,
        enableReinitialize: true,

        validate: (values) => {
            const errors: Partial<Record<keyof EmployeeFormState, string>> = {};

            if (!values.firstName.trim())
                errors.firstName = "First name is required";

            if (!values.lastName.trim())
                errors.lastName = "Last name is required";

            if (!values.mobileNumber.match(/^[0-9]{10}$/))
                errors.mobileNumber = "Mobile must be 10 digits";

            if (values.salary <= 0)
                errors.salary = "Salary must be greater than 0";

            if (!values.joiningDate)
                errors.joiningDate = "Joining date required";

            if (!values.address.trim())
                errors.address = "Address is required";

            if (!values.qualification.trim())
                errors.qualification = "Qualification is required";

            if (values.experience < 0)
                errors.experience = "Experience must be a positive number";

            if (!values.dateOfBirth)
                errors.dateOfBirth = "Date of birth is required";

            return errors;
        },

        onSubmit: async (values) => {
            try {
                if (!employeeIdParam) throw new Error("No employeeId in route");
                setSaving(true);

                // 1. Fetch the employee to get the teacherId
                const employeeRes = await axiosClient.post("", {
                    query: GET_EMPLOYEE_BY_ID_QUERY,
                    variables: { employeeId: Number(employeeIdParam) },
                });
                const employee = employeeRes?.data?.data?.employee?.data;
                const teacherId = employee?.teacher?.id;

                if (values.type === EmployeeType.TEACHER) {
                    if (!teacherId) {
                        toast.error("No teacherId found for this employee. Make sure this employee is a teacher.");
                        return;
                    }
                    await axiosClient.post("", {
                        query: UPDATE_TEACHER_MUTATION,
                        variables: {
                            teacherId: Number(teacherId),
                            data: {
                                qualification: values.qualification,
                                experience: Number(values.experience),
                                gender: values.gender,
                                dateOfBirth: values.dateOfBirth,
                            }
                        }
                    });
                }

                const response = await axiosClient.post("", {
                    query: UPDATE_EMPLOYEE_MUTATION,
                    variables: {
                        employeeId: Number(employeeIdParam),
                        data: {
                            firstName: values.firstName,
                            lastName: values.lastName,
                            mobileNumber: values.mobileNumber,
                            address: values.address,
                            joiningDate: values.joiningDate,
                            salary: Number(values.salary),
                            status: values.status,
                            type: values.type,
                        }
                    },
                });

                const json = response.data;

                // 🔥 Handle GraphQL errors
                if (json.errors) {
                    throw new Error(
                        json.errors?.[0]?.message || "Failed to update employee",
                    );
                }

                const result = json.data?.updateEmployee;

                if (!result || result.status !== "success") {
                    throw new Error(result?.message || "Failed to update employee");
                }

                toast.success(result.message || "Employee updated successfully ✅");
                router.push("/employees");
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message || "Update failed");
            } finally {
                setSaving(false);
            }
        },
    });

    if (loading) {
        return (
            <div className="p-6">
                <button
                    className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
                <p className="text-gray-500">Loading Employees details…</p>
            </div>
        );
    }

    const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
        formik;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Employee
                    </h1>
                </div>
                <span className="text-sm text-gray-500">ID: {employeeIdParam}</span>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6"
            >

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {touched.firstName && errors.firstName && (
                            <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {touched.lastName && errors.lastName && (
                            <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                        )}
                    </div>

                </div>

                {/* Mobile + Joining Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mobile Number
                        </label>
                        <input
                            name="mobileNumber"
                            value={values.mobileNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={10}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {touched.mobileNumber && errors.mobileNumber && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobileNumber}</p>
                        )}

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Joining Date
                        </label>
                        <input
                            type="date"
                            name="joiningDate"
                            value={values.joiningDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {touched.joiningDate && errors.joiningDate && (
                            <p className="mt-1 text-xs text-red-500">{errors.joiningDate}</p>
                        )}
                    </div>

                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={2}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {touched.address && errors.address && (
                        <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                    )}
                </div>

                {/* Salary + Status + Role */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Salary
                        </label>
                        <input
                            type="number"
                            name="salary"
                            value={values.salary}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {touched.salary && errors.salary && (
                            <p className="mt-1 text-xs text-red-500">{errors.salary}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value={EmployeeType.ADMIN_STAFF}>Admin Staff</option>
                            <option value={EmployeeType.TEACHER}>Teacher</option>
                            <option value={EmployeeType.ACCOUNTANT}>Accountant</option>
                        </select>
                    </div>

                </div>

                {values.type === EmployeeType.ADMIN_STAFF && (
                    <div>
                        <label>Department</label>
                        <input
                            name="staffDepartment"
                            value={values.staffDepartment}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {touched.staffDepartment && errors.staffDepartment && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.staffDepartment}
                            </p>
                        )}
                    </div>
                )}

                {values.type === EmployeeType.TEACHER && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label>Qualification</label>
                            <input
                                name="qualification"
                                value={values.qualification}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.qualification && errors.qualification && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.qualification}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Gender</label>
                            <input
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.gender && errors.gender && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Experience</label>
                            <input
                                type="number"
                                name="experience"
                                value={values.experience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.experience && errors.experience && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.experience}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={values.dateOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.dateOfBirth && errors.dateOfBirth && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.dateOfBirth}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {values.type === EmployeeType.ACCOUNTANT && (
                    <>
                        <div>
                            <label>Certification</label>
                            <input
                                name="certification"
                                value={values.certification}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.certification && errors.certification && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.certification}
                                </p>
                            )}
                        </div>
                        <div>
                            <label>Accountant Experience</label>
                            <input
                                name="Accexperience"
                                value={values.Accexperience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {touched.Accexperience && errors.Accexperience && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.Accexperience}
                                </p>
                            )}
                        </div>
                    </>
                )}



                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.push("/employees")}
                        className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    );

}
