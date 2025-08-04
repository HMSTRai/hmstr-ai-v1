// app/(auth)/sign-up/page.jsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src="/HMSTR-official-logo.png" alt="HMSTR.ai Logo" className="mx-auto h-24" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign Up</h2>
          <p className="mt-3 text-sm text-gray-600">
            Create an account for HMSTR.ai Dashboard
          </p>
        </div>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/lock-screen"
          afterSignUpUrl="/"
          appearance={{
            elements: {
              formButtonPrimary: "bg-orange-600 hover:bg-orange-800 text-white",
            },
          }}
        />
      </div>
    </div>
  );
}