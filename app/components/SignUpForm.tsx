// components/SignupForm.tsx
import React, { useState } from "react";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SIGNUP_MUTATION = `
  mutation Signup($email: String!, $password: String!, $name: String!, $role: Role!) {
    signup(email: $email, password: $password, name: $name, role: $role) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export default function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("student"); // default
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
      if (!endpoint) throw new Error("Backend URL missing!");

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SIGNUP_MUTATION,
          variables: {
            email,
            password,
            name: fullName,
            role,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok || json.errors) {
        throw new Error(json.errors?.[0]?.message || "Signup failed");
      }

      const token = json.data?.signup?.token;
      const user = json.data?.signup?.user;

      if (!token) throw new Error("No token received");

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Account created successfully! 🎉");

      // redirect after 1 sec so toast displays
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
      <h2 className="text-2xl font-extrabold text-gray-900 text-center">Create Account</h2>
      <p className="text-gray-500 text-center mb-6">Join your school dashboard</p>

      {/* First + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 
                      focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 
                      focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 
                      focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 
                      focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 focus:outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-[1.01] transition disabled:opacity-60"
      >
        <UserPlus className="inline mr-2" size={18} />
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
