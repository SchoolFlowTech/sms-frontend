"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
// import {
//   getEmployeeById,
//   updateEmployee,
//   Employee,
// } from "@/app/store/employeeStore";

type EmployeeFormState = {
    firstName: string;
    lastName: string;
    role: string;
    mobileNumber: string;
    address: string;
    salary: number;
    joiningDate: string;
    status: string;

    // For Teachers
    qualification: "",
    experience: 0,
    dateOfBirth: "",

};

const EMPTY_VALUES: EmployeeFormState = {
    firstName: "",
    lastName: "",
    role: "",
    mobileNumber: "",
    address: "",
    salary: 0,
    joiningDate: "",
    status: "Active",
    qualification: "",
    experience: 0,
    dateOfBirth: "",
};

export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const employeeIdParam = params?.employeeId as string;

    const [initialValues, setInitialValues] =
        useState<EmployeeFormState>(EMPTY_VALUES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!employeeIdParam) return;

        // const employee = getEmployeeById(Number(employeeIdParam));

        // if (!employee) {
        //   toast.error("Employee not found");
        //   router.push("/employees");
        //   return;
        // }

        setInitialValues({
            firstName: "",
            lastName: "",
            role: "",
            mobileNumber: "",
            address: "",
            salary: 0,
            joiningDate: "",
            status: "Active",
            qualification: "",
            experience: 0,
            dateOfBirth: "",
        });

        setLoading(false);
    }, [employeeIdParam, router]);

    const formik = useFormik<EmployeeFormState>({
        initialValues,
        enableReinitialize: true,

        validate: (values) => {
            const errors: Partial<Record<keyof EmployeeFormState, string>> = {};

            if (!values.firstName.trim())
                errors.firstName = "First name is required";

            if (!values.lastName.trim())
                errors.lastName = "Last name is required";

            if (!values.role.trim())
                errors.role = "Role is required";

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

        onSubmit: (values) => {
            if (!employeeIdParam) return;

            try {
                setSaving(true);

                // updateEmployee({
                //   id: Number(employeeIdParam),
                //   ...values,
                // } as Employee);

                toast.success("Employee updated successfully ✅");

                router.push("/employees");
            } catch {
                toast.error("Update failed");
            } finally {
                setSaving(false);
            }
        },
    });

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading employee details...</p>
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
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
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
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                </div>


                {values.role === "Teacher" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Qualification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Qualification
                            </label>
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

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Experience (Years)
                            </label>
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

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Date of Birth
                            </label>
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
