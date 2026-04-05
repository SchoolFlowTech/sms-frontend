"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import axiosClient from "@/app/lib/axiosClient";
import { CREATE_EMPLOYEE_MUTATION } from "../../../gql/Employee/employee";

const EmployeeType = {
    TEACHER: "TEACHER",
    ACCOUNTANT: "ACCOUNTANT",
    ADMIN_STAFF: "ADMIN",
    PRINCIPAL: "PRINCIPAL",
    LIBRARIAN: "LIBRARIAN",
    SUPPORT_STAFF: "SUPPORT_STAFF"
} as const;

type EmployeeTypeType = typeof EmployeeType[keyof typeof EmployeeType];

type EmployeeFormState = {
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    mobileNumber: string;
    address: string;
    qualification?: string;
    experience?: number;
    joiningDate: string;
    salary: number;
    status: string;
    type: EmployeeTypeType;

    certification?: string;
    Accexperience?: string;

    staffDepartment?: string;
};

const getInitialValues = (type: EmployeeTypeType): EmployeeFormState => {
    const base = {
        firstName: "",
        lastName: "",
        mobileNumber: "",
        address: "",
        salary: 0,
        joiningDate: "",
        status: "Active",
        type
    };

    switch (type) {
        case EmployeeType.TEACHER:
            return {
                ...base,
                type: EmployeeType.TEACHER,
                qualification: "",
                experience: 0,
                dateOfBirth: "",
                gender: ""
            };

        case EmployeeType.ACCOUNTANT:
            return {
                ...base,
                type: EmployeeType.ACCOUNTANT,
                certification: "",
                Accexperience: ""
            };

        case EmployeeType.ADMIN_STAFF:
            return {
                ...base,
                type: EmployeeType.ADMIN_STAFF,
                staffDepartment: ""
            };

        default:
            throw new Error("Invalid type");
    }
};

export default function NewEmployeePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

    const formik = useFormik({
        initialValues: getInitialValues(EmployeeType.ADMIN_STAFF),

        validate: (values) => {
            const errors: any = {};

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

            if (!values.address.trim()) {
                errors.address = "Address is required";
            }

            if (values.type === EmployeeType.TEACHER) {
                if (!values.qualification?.trim()) {
                    errors.qualification = "Qualification is required for teachers";
                }

                if (!values.experience) {
                    errors.experience = "Experience is required for teachers";
                }

                if (!values.dateOfBirth) {
                    errors.dateOfBirth = "Date of Birth is required for teachers";
                }

                if (!values.gender) {
                    errors.gender = "Gender is required for teachers";
                }
            }

            if (values.type === EmployeeType.ACCOUNTANT) {
                if (!values.certification) {
                    errors.certification = "certification is required for Accountant";
                }

                if (!values.Accexperience) {
                    errors.Accexperience = "Accexperience is required for Accountant";
                }

            }

            if (values.type === EmployeeType.ADMIN_STAFF) {
                if (!values.staffDepartment) {
                    errors.staffDepartment = "Department is required for Admin Staff";
                }
            }

            return errors;
        },

        onSubmit: async (values) => {
            try {
                if (!endpoint) throw new Error("Backend URL missing!")
                setSaving(true);

                // Build the data object based on the type
                let data: any = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    mobileNumber: values.mobileNumber,
                    address: values.address,
                    salary: Number(values.salary),
                    joiningDate: values.joiningDate,
                    status: values.status,
                    type: values.type,
                };

                if (values.type === EmployeeType.TEACHER) {
                    data.qualification = values.qualification;
                    data.experience = values.experience;
                    data.gender = values.gender;
                    data.dateOfBirth = values.dateOfBirth;
                } else if (values.type === EmployeeType.ACCOUNTANT) {
                    data.certification = values.certification;
                    data.Accexperience = values.Accexperience;
                } else if (values.type === EmployeeType.ADMIN_STAFF) {
                    data.staffDepartment = values.staffDepartment;
                }

                const response = await axiosClient.post("", {
                    query: CREATE_EMPLOYEE_MUTATION,
                    variables: {
                        data
                    },
                });


                const json = response.data;

                // 🔥 Handle GraphQL errors
                if (json.errors) {
                    throw new Error(
                        json.errors?.[0]?.message || "Failed to create Employee",
                    );
                }

                const result = json.data?.createEmployee;
                if (!result || result.status !== "success") {
                    throw new Error(result?.message || "Failed to create employee");
                }

                toast.success(result.message || "Employee created successfully 🎉");
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
                    <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
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
                            placeholder="Enter your first name..."
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
                            placeholder="Enter your last name..."
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
                            placeholder="Enter your mobile number..."
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
                        placeholder="Enter your address..."
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
                            type="number"
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
                            name="type"
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={EmployeeType.ADMIN_STAFF}>Admin Staff</option>
                            <option value={EmployeeType.TEACHER}>Teacher</option>
                            <option value={EmployeeType.ACCOUNTANT}>Accountant</option>
                            <option value="Other">Other</option>
                        </select>
                        {/* {touched.role && errors.role && (
                            <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                        )} */}
                    </div>

                </div>

                {values.type === EmployeeType.ADMIN_STAFF && (
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <input
                                name="staffDepartment"
                                value={values.staffDepartment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your Department..."
                            />
                            {touched.staffDepartment && errors.staffDepartment && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.staffDepartment}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {values.type === EmployeeType.TEACHER && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                                placeholder="Enter your qualification..."
                            />
                            {touched.qualification && errors.qualification && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.qualification}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <input
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your gender..."
                            />
                            {touched.gender && errors.gender && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.gender}
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
                                placeholder="Enter your experience in years..."
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

                {values.type === EmployeeType.ACCOUNTANT && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Certification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certification
                            </label>
                            <input
                                name="certification"
                                value={values.certification}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your certification..."
                            />
                            {touched.certification && errors.certification && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.certification}
                                </p>
                            )}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Experience
                            </label>
                            <input
                                name="Accexperience"
                                value={values.Accexperience}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your Accountant Experience..."
                            />
                            {touched.Accexperience && errors.Accexperience && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.Accexperience}
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
                        {saving ? "Saving..." : "Create Employee"}
                    </button>
                </div>
            </form>
        </div>
    );
}
