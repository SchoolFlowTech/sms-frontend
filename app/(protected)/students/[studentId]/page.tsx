"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useFormik } from "formik";
import axiosClient from "../../../lib/axiosClient";

const GET_STUDENT_QUERY = `
  query GetStudent($studentId: Int!) {
    student(studentId: $studentId) {
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
        class
        section
        rollNumber
        admissionDate
        status
      }
    }
  }
`;

const UPDATE_STUDENT_MUTATION = `
  mutation UpdateStudent(
    $studentId: Int!
    $firstName: String!
    $lastName: String!
    $gender: String!
    $dateOfBirth: String!
    $mobileNumber: String!
    $address: String!
    $class: String!
    $section: String!
    $rollNumber: String!
    $admissionDate: String!
    $status: String!
  ) {
    updateStudent(
      studentId: $studentId
      firstName: $firstName
      lastName: $lastName
      gender: $gender
      dateOfBirth: $dateOfBirth
      mobileNumber: $mobileNumber
      address: $address
      class: $class
      section: $section
      rollNumber: $rollNumber
      admissionDate: $admissionDate
      status: $status
    ) {
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
        class
        section
        rollNumber
        admissionDate
        status
      }
    }
  }
`;

type StudentFormState = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  address: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  status: string;
};

const EMPTY_VALUES: StudentFormState = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  mobileNumber: "",
  address: "",
  class: "",
  section: "",
  rollNumber: "",
  admissionDate: "",
  status: "Active",
};

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentIdParam = params?.studentId as string;

  const [initialValues, setInitialValues] =
    useState<StudentFormState>(EMPTY_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  // Fetch the student details on mount

useEffect(() => {
  async function fetchStudent() {
    try {
      setLoading(true);

      if (!studentIdParam) throw new Error("No studentId in route");

      const res = await axiosClient.post("", {
        query: GET_STUDENT_QUERY,
        variables: {
          studentId: Number(studentIdParam),
        },
      });

      // GraphQL errors (200 OK but failed)
      if (res.data.errors) {
        throw new Error(
          res.data.errors[0]?.message || "Failed to fetch student"
        );
      }

      const student = res.data?.data?.student?.data;
      if (!student) {
        throw new Error("Student not found");
      }

      setInitialValues({
        firstName: student.firstName ?? "",
        lastName: student.lastName ?? "",
        gender: student.gender ?? "",
        dateOfBirth: student.dateOfBirth ?? "",
        mobileNumber: student.mobileNumber ?? "",
        address: student.address ?? "",
        class: student.class ?? "",
        section: student.section ?? "",
        rollNumber: student.rollNumber ?? "",
        admissionDate: student.admissionDate ?? "",
        status: student.status ?? "Active",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  }

  fetchStudent();
}, [studentIdParam]);


  // Formik setup
  const formik = useFormik<StudentFormState>({
    initialValues,
    enableReinitialize: true, // important so values update when initialValues change
    validate: (values) => {
      const errors: Partial<Record<keyof StudentFormState, string>> = {};

      if (!values.firstName.trim()) errors.firstName = "First name is required";
      if (!values.lastName.trim()) errors.lastName = "Last name is required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.dateOfBirth) errors.dateOfBirth = "DOB is required";
      if (!values.mobileNumber.trim())
        errors.mobileNumber = "Mobile is required";
      if (!values.address.trim()) errors.address = "Address is required";
      if (!values.class.trim()) errors.class = "Class is required";
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
        if (!studentIdParam) throw new Error("No studentId in route");

        setSaving(true);

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            query: UPDATE_STUDENT_MUTATION,
            variables: {
              studentId: Number(studentIdParam),
              ...values,
            },
          }),
        });

        const json = await res.json();
        console.log("update student json", json);

        if (!res.ok || json.errors) {
          throw new Error(
            json.errors?.[0]?.message || "Failed to update student"
          );
        }

        toast.success("Student updated successfully ✅");
        router.push("/students");
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
        <p className="text-gray-500">Loading student details…</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
        </div>
        <span className="text-sm text-gray-500">ID: {studentIdParam}</span>
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
              name="class"
              value={values.class}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1st year"
            />
            {touched.class && errors.class && (
              <p className="mt-1 text-xs text-red-500">{errors.class}</p>
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
