"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
import { CREATE_STUDENT_MUTATION } from "../../../gql/Students/students";
import axiosClient from "@/app/lib/axiosClient";

type StudentFormState = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  address: string;
  className: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  status: string;
};

const INITIAL_VALUES: StudentFormState = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  mobileNumber: "",
  address: "",
  className: "",
  section: "",
  rollNumber: "",
  admissionDate: "",
  status: "Active",
};

export default function NewStudentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  const formik = useFormik<StudentFormState>({
    initialValues: INITIAL_VALUES,
    validate: (values) => {
      const errors: Partial<Record<keyof StudentFormState, string>> = {};

      if (!values.firstName.trim()) errors.firstName = "First name is required";
      if (!values.lastName.trim()) errors.lastName = "Last name is required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.dateOfBirth) errors.dateOfBirth = "DOB is required";
      if (!values.mobileNumber.trim())
        errors.mobileNumber = "Mobile is required";
      if (!values.address.trim()) errors.address = "Address is required";
      if (!values.className.trim()) errors.className = "Class is required";
      if (!values.section.trim()) errors.section = "Section is required";
      if (!values.rollNumber.trim())
        errors.rollNumber = "Roll number is required";
      if (!values.admissionDate)
        errors.admissionDate = "Admission date is required";
      if (!values.status) errors.status = "Status is required";

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (!endpoint) throw new Error("Backend URL missing!");
        setSaving(true);

        const response = await axiosClient.post("", {
          query: CREATE_STUDENT_MUTATION,
          variables: values,
        });

        const json = response.data;
        console.log("create student json", json);

        // 🔥 Handle GraphQL errors
        if (json.errors) {
          throw new Error(
            json.errors?.[0]?.message || "Failed to create student",
          );
        }

        const result = json.data?.createStudent;

        if (!result || result.status !== "success") {
          throw new Error(result?.message || "Failed to create student");
        }

        toast.success(result.message || "Student created successfully 🎉");
        router.push("/students");
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
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
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {touched.mobileNumber && errors.mobileNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admission Date
            </label>
            <input
              type="date"
              name="admissionDate"
              value={values.admissionDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {touched.admissionDate && errors.admissionDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.admissionDate}
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
              Class
            </label>
            <input
              name="className"
              value={values.className}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1st year"
            />
            {touched.className && errors.className && (
              <p className="mt-1 text-xs text-red-500">{errors.className}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <input
              name="section"
              value={values.section}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. A"
            />
            {touched.section && errors.section && (
              <p className="mt-1 text-xs text-red-500">{errors.section}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              name="rollNumber"
              value={values.rollNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. bca101"
            />
            {touched.rollNumber && errors.rollNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.rollNumber}</p>
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
            onClick={() => router.push("/students")}
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
            {saving ? "Saving..." : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
