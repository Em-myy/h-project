"use client";

import { createClient } from "@/utils/supabase/client";
import { DEPARTMENTS } from "@/utils/helpers";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Files } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  const [activeView, setActiveView] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [department, setDepartment] = useState("");
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm({ ...signUpForm, [event.target.name]: event.target.value });
  };

  const handleDepartment = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(event.target.value);
  };

  const handleSignInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm({ ...signInForm, [event.target.name]: event.target.value });
  };

  const toggleView = (view: "signin" | "signup") => {
    setActiveView((prev) => (prev === "signin" ? "signup" : "signin"));
    setMessage(null);
    setShowPassword(false);
  };

  const handleSignUp = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!department) {
      setMessage({ type: "error", text: "Select a department to continue." });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          data: {
            username: signUpForm.username,
            department: department,
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created successfully! Check your mail for more information",
      });

      setSignUpForm({
        username: "",
        email: "",
        password: "",
      });
      setDepartment("");

      setActiveView("signin");
    } catch (error: any) {
      setMessage({ type: "error", text: "Error creating account" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: signInForm.email,
          password: signInForm.password,
        });

      if (authError) {
        setMessage({ type: "error", text: authError.message });
        return;
      }

      if (authData?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          setMessage({
            type: "error",
            text: "Failed to load user profile. Please contact IT.",
          });
          return;
        }

        if (profile.role === "staff") {
          router.push("/staff/home");
        } else if (profile.role === "admin") {
          router.push("/admin/home");
        } else {
          router.refresh();
        }
      }
    } catch (error: any) {
      setMessage({ type: "error", text: "Error signing in" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-100";
  const labelClass =
    "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800/40">
              <Files className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Document Digitization
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Staff Portal Access
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex w-full rounded-lg bg-slate-100 p-1 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={() => toggleView("signin")}
              className={`w-1/2 cursor-pointer rounded-md py-2 text-sm font-medium transition-all ${
                activeView === "signin"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => toggleView("signup")}
              className={`w-1/2 cursor-pointer rounded-md py-2 text-sm font-medium transition-all ${
                activeView === "signup"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm ${
                message.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                  : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {activeView === "signin" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Sign in to access the document digitization system.
                </p>
              </div>
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={signInForm.email}
                    required
                    placeholder="famuyiwaemmanuel565@gmail.com"
                    onChange={handleSignInChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={signInForm.password}
                      required
                      placeholder="••••••••"
                      onChange={handleSignInChange}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 cursor-pointer"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Create an Account
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Register for staff access to manage and digitize records.
                </p>
              </div>
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={signUpForm.username}
                    required
                    placeholder="Haliyah"
                    onChange={handleSignUpChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={signUpForm.email}
                    placeholder="famuyiwaemmanuel565@gmail.com"
                    required
                    onChange={handleSignUpChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Department</label>
                  <select
                    name="department"
                    value={department}
                    required
                    onChange={handleDepartment}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-white dark:bg-slate-900"
                    >
                      Select a department
                    </option>
                    {DEPARTMENTS.map((dept) => (
                      <option
                        key={dept}
                        value={dept}
                        className="bg-white dark:bg-slate-900"
                      >
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={signUpForm.password}
                      required
                      placeholder="••••••••"
                      onChange={handleSignUpChange}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 cursor-pointer"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
