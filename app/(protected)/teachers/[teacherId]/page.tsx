"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
import axiosClient from "../../../lib/axiosClient";

const GET_TEACHER_QUERY = `
  query GetTeacher($teacherId: Int!) {
    teacher(teacherId: $teacherId) {
      status
      message
      data {
        teacherId
        firstName
        lastName
        gender
        dateOfBirth
        mobileNumber
        address
        qualification
        experience
        joiningDate
        salary
        status
      }
    }
  }
`;

const UPDATE_TEACHER_MUTATION = `
  mutation UpdateTeacher(
    $teacherId: Int!
    $firstName: String!
    $lastName: String!
    $gender: String!
    $dateOfBirth: String!
    $mobileNumber: String!
    $address: String!
    $qualification: String!
    $experience: Int!
    $joiningDate: String!
    $salary: Float!
    $status: String!
  ) {
    updateTeacher(
      teacherId: $teacherId
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      dateOfBirth: $dateOfBirth
      mobileNumber: $mobileNumber
      address: $address
      qualification: $qualification
      experience: $experience
      joiningDate: $joiningDate
      salary: $salary
      status: $status
    ) {
      status
      message
      data {
        teacherId
        firstName
        lastName
        gender
        dateOfBirth
        mobileNumber
        address
        qualification
        experience
        joiningDate
        salary
        status
      }
    }
  }
`;

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

const EMPTY_VALUES: TeacherFormState = {
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

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherIdParam = params?.teacherId as string;

  const [initialValues, setInitialValues] =
    useState<TeacherFormState>(EMPTY_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  // Fetch the teacher details on mount

  useEffect(() => {
    async function fetchTeacher() {
      try {
        setLoading(true);

        if (!teacherIdParam) throw new Error("No teacherId in route");

        const res = await axiosClient.post("", {
          query: GET_TEACHER_QUERY,
          variables: {
            teacherId: Number(teacherIdParam),
          },
        });

        // GraphQL errors (200 OK but failed)
        if (res.data.errors) {
          throw new Error(
            res.data.errors[0]?.message || "Failed to fetch teacher details",
          );
        }

        const teacher = res.data?.data?.teacher?.data;
        if (!teacher) {
          throw new Error("Teacher not found");
        }

        setInitialValues({
          firstName: teacher.firstName ?? "",
          lastName: teacher.lastName ?? "",
          gender: teacher.gender ?? "",
          mobileNumber: teacher.mobileNumber ?? "",
          address: teacher.address ?? "",
          qualification: teacher.qualification ?? "",
          experience: teacher.experience ?? 0,
          joiningDate: teacher.joiningDate
            ? new Date(Number(teacher.joiningDate)).toISOString().split("T")[0]
            : "",

          dateOfBirth: teacher.dateOfBirth
            ? new Date(Number(teacher.dateOfBirth)).toISOString().split("T")[0]
            : "",

          salary: teacher.salary ?? 0.0,
          status: teacher.status ?? "Active",
        });
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Failed to load teacher");
      } finally {
        setLoading(false);
      }
    }

    fetchTeacher();
  }, [teacherIdParam]);

  // Formik setup
  const formik = useFormik<TeacherFormState>({
    initialValues,
    enableReinitialize: true, // important so values update when initialValues change
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
      if (!values.salary) errors.salary = "Salary is required";
      if (!values.joiningDate.trim())
        errors.joiningDate = "Joining date is required";
      if (!values.status) errors.status = "Status is required";

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (!teacherIdParam) throw new Error("No teacherId in route");

        setSaving(true);

        const response = await axiosClient.post("", {
          query: UPDATE_TEACHER_MUTATION,
          variables: {
            teacherId: Number(teacherIdParam),
            ...values,
            experience: Number(values.experience),       // ✅ convert to number
            salary: Number(values.salary),               // ✅ convert to number
            dateOfBirth: new Date(values.dateOfBirth).toISOString(),
            joiningDate: new Date(values.joiningDate).toISOString(),
          },
        });

        const json = response.data;
        console.log("update teacher json", json);

        // 🔥 Handle GraphQL errors
        if (json.errors) {
          throw new Error(
            json.errors?.[0]?.message || "Failed to update teacher",
          );
        }

        const result = json.data?.updateTeacher;

        if (!result || result.status !== "success") {
          throw new Error(result?.message || "Failed to update teacher");
        }

        toast.success(result.message || "Teacher updated successfully ✅");
        router.push("/teachers");
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
        <p className="text-gray-500">Loading teacher details…</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Teacher</h1>
        </div>
        <span className="text-sm text-gray-500">ID: {teacherIdParam}</span>
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

        {/* Contact + Address */}
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
              placeholder="e.g. 5 years"
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
              placeholder="e.g. 50000"
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
