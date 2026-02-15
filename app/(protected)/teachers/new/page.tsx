"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
import { CREATE_TEACHER_MUTATION } from "../../../gql/Teachers/teacher";
import axiosClient from "@/app/lib/axiosClient";
// import { CREATE_TEACHER_MUTATION } from "@/app/gql/Teachers/teacher";

type TeacherFormState = {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    mobileNumber: string;
    address: string;
    qualification: string;
    experience: number;
    joiningDate: string;
    salary: number;
    status: string;
};

const INITIAL_VALUES: TeacherFormState = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    address: "",
    qualification: "",
    experience: 0,
    joiningDate: "",
    salary: 0.0,
    status: "Active",
};

export default function NewTeacherPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

    const formik = useFormik<TeacherFormState>({
        initialValues: INITIAL_VALUES,
        validate: (values) => {
            const errors: Partial<Record<keyof TeacherFormState, string>> = {};

            if (!values.firstName.trim()) errors.firstName = "First name is required";
            if (!values.lastName.trim()) errors.lastName = "Last name is required";
            if (!values.gender) errors.gender = "Gender is required";
            if (!values.dateOfBirth) errors.dateOfBirth = "DOB is required";
            if (!values.mobileNumber.trim())
                errors.mobileNumber = "Mobile is required";
            if (!values.address.trim()) errors.address = "Address is required";
            if (!values.qualification.trim()) errors.qualification = "Qualification is required";
            if (!values.experience) errors.experience = "Experience is required";
            if (!values.joiningDate) errors.joiningDate = "Joining date is required";
            if (!values.salary) errors.salary = "Salary is required";
            if (!values.status) errors.status = "Status is required";

            return errors;
        },
        onSubmit: async (values) => {
            console.log("value<><<>", values)
            try {
                if (!endpoint) throw new Error("Backend URL missing!");
                setSaving(true);

                const response = await axiosClient.post("", {
                    query: CREATE_TEACHER_MUTATION,
                    variables: {
                        ...values,
                        userId: 1,
                        experience: Number(values.experience),
                        salary: Number(values.salary),
                        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
                        joiningDate: new Date(values.joiningDate).toISOString(),
                    },
                });

                const json = response.data;
                console.log("create teacher json", json);

                // 🔥 Handle GraphQL errors
                if (json.errors) {
                    throw new Error(
                        json.errors?.[0]?.message || "Failed to create teacher",
                    );
                }

                const result = json.data?.createTeacher;

                if (!result || result.status !== "success") {
                    throw new Error(result?.message || "Failed to create teacher");
                }

                toast.success(result.message || "Teacher created successfully 🎉");
                router.push("/teachers");
            } catch (err: any) {
                console.error(err);
                toast.error(err?.message || "Creation failed");
            } finally {
                setSaving(false);
            }
        },
    });

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                        )}
                    </div>
                </div>

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
                            Qualification
                        </label>
                        <input
                            name="qualification"
                            value={values.qualification}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 1st year"
                        />
                        {touched.qualification && errors.qualification && (
                            <p className="mt-1 text-xs text-red-500">{errors.qualification}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Experience
                        </label>
                        <input
                            name="experience"
                            value={values.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 1st year"
                        />
                        {touched.experience && errors.experience && (
                            <p className="mt-1 text-xs text-red-500">{errors.experience}</p>
                        )}
                    </div>

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
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                </div>

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
