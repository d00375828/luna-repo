"use client";
import { DEV_BYPASS } from "@/lib/devSession";
import Link from "next/link";
export default function LoginPage() {
  if (DEV_BYPASS) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-xl border p-6">
          <h1 className="text-2xl font-semibold">Dev Mode</h1>
          <p className="text-sm text-gray-600">Auth is bypassed right now.</p>
          <Link className="underline text-sm" href="/">
            Go to dashboard
          </Link>
          Go to dashboard
        </div>
      </div>
    );
  }

  return <div className="p-6">Auth UI goes here later.</div>;
}
