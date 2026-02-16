"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
// import { addEmployee } from "@/app/store/employeeStore";

export default function NewEmployeePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            role: "",
            mobileNumber: "",
            address: "",
            salary: 0,
            joiningDate: "",
            status: "Active",


            // For Teachers
            qualification: "",
            experience: "",
            dateOfBirth: "",


        },

        validate: (values) => {
            const errors: any = {};

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

            return errors;
        },

        onSubmit: (values) => {
            try {
                setSaving(true);

                const newEmployee = {
                    id: Date.now(),
                    ...values,
                };

                // addEmployee(newEmployee);

                toast.success("Employee created successfully 🎉");

                router.push("/employees");
            } catch {
                toast.error("Something went wrong");
            } finally {
                setSaving(false);
            }
        },
    });

    const { values, handleChange, handleBlur, handleSubmit, touched, errors } = formik;

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
                    <h1 className="text-2xl font-bold text-gray-900">Add New Teacher</h1>
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

                {/* Gender + DOB */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {touched.gender && errors.gender && (
                                <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
                            )}
                        </div>
                    </div> */}

                {/* Contact + Admission Date */}
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
                            minLength={0}
                            maxLength={10}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {touched.joiningDate && errors.joiningDate && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.joiningDate}
                            </p>
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
                        className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={2}
                    />
                    {touched.address && errors.address && (
                        <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                    )}
                </div>

                {/* Class + Section + Roll */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Salary
                        </label>
                        <input
                            name="salary"
                            value={values.salary}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 10000"
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
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        {touched.status && errors.status && (
                            <p className="mt-1 text-xs text-red-500">{errors.status}</p>
                        )}
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
                            defaultValue={"Admin"}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Staff">Staff</option>
                            <option value="Librarian">Librarian</option>
                            <option value="Other">Other</option>
                        </select>
                        {touched.role && errors.role && (
                            <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                        )}
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


                {/* Status */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {touched.status && errors.status && (
                                <p className="mt-1 text-xs text-red-500">{errors.status}</p>
                            )}
                        </div>

                    </div> */}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.push("/teachers")}
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
                        {saving ? "Saving..." : "Create Teacher"}
                    </button>
                </div>
            </form>
        </div>
    );
}
