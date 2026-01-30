"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { DEV_BYPASS } from "@/lib/devSession";
import { supabase } from "@/lib/supabaseClient";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (DEV_BYPASS) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-xl border p-6 space-y-3">
          <h1 className="text-2xl font-semibold">Dev Mode</h1>
          <p className="text-sm text-gray-600">Auth is bypassed right now.</p>
          <Link className="underline text-sm" href="/">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setError("Please provide your name.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          throw signInError;
        }

        if (data.user) {
          await syncUserProfile({
            auth_user_id: data.user.id,
            email: data.user.email ?? email,
            full_name:
              (data.user.user_metadata?.full_name as string | undefined) ?? "",
          });
        }

        router.push("/");
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          await syncUserProfile({
            auth_user_id: data.user.id,
            email,
            full_name: fullName,
          });
        }

        setInfo("Check your inbox to confirm your email before signing in.");
        setMode("signin");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border p-6 shadow-sm">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </p>
          <h1 className="text-2xl font-semibold mt-1">Luna Dashboard</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium">
            <span>Email</span>
            <input
              className="w-full rounded-lg border px-3 py-2 text-base"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          {mode === "signup" && (
            <label className="block space-y-2 text-sm font-medium">
              <span>Full name</span>
              <input
                className="w-full rounded-lg border px-3 py-2 text-base"
                type="text"
                placeholder="Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                required
              />
            </label>
          )}

          <label className="block space-y-2 text-sm font-medium">
            <span>Password</span>
            <input
              className="w-full rounded-lg border px-3 py-2 text-base"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {info && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-70"
            disabled={loading}
          >
            {loading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium underline"
            onClick={() =>
              setMode((prev) => (prev === "signin" ? "signup" : "signin"))
            }
            disabled={loading}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

async function syncUserProfile(params: {
  auth_user_id: string;
  email: string;
  full_name?: string;
}) {
  const { error } = await supabase.from("users").upsert(
    {
      auth_user_id: params.auth_user_id,
      email: params.email,
      full_name: params.full_name ?? null,
    },
    {
      onConflict: "auth_user_id",
    }
  );

  if (error) throw error;
}
