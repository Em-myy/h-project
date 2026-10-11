"use client";

import { createClient } from "@/utils/supabase/client";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

const InvitePage = () => {
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [pageStatus, setPageStatus] = useState<
    "checking" | "expired" | "valid"
  >("checking");

  useEffect(() => {
    const checkSession = async () => {
      const hash = window.location.hash;
      const queryParams = new URLSearchParams(window.location.search);

      if (
        hash.includes("error_description") ||
        queryParams.has("error_description")
      ) {
        setMessage({
          type: "error",
          text: "Your invitation link has expired or is invalid",
        });
        setPageStatus("expired");
        return;
      }

      if (hash.includes("access_token=")) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setPageStatus("valid");
            return;
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setMessage({
          type: "error",
          text: "No active invitation. Link may have expired.",
        });
        setPageStatus("expired");
      } else {
        setPageStatus("valid");
      }
    };

    checkSession();
  }, [supabase]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSetupAccount = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
        data: {
          username: formData.username,
        },
      });
      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: "Account setup successfully" });
      setTimeout(() => {
        router.push("/admin/home");
      }, 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (pageStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
          <p className="font-medium animate-pulse">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (pageStatus === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-50 p-4 dark:bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
          </div>
          <h1 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Invitation Expired
          </h1>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            {message?.text}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Please contact your IT administrator to request a new invitation
            link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Complete your account
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You have been invited to join the IT workspace. Please set your
            username and password to continue.
          </p>
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
        <form onSubmit={handleSetupAccount} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              required
              placeholder="e.g. Haliyah"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label>Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                required
                minLength={6}
                placeholder="••••••••"
                onChange={handleChange}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Must be at least 6 characters long.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus:ring-offset-slate-900"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting Up Account...
              </>
            ) : (
              "Setup Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvitePage;
