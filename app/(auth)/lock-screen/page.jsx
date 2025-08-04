// app/(auth)/lock-screen/page.jsx
"use client";

import { SignIn } from "@clerk/nextjs"; // Add this import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LockScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-4">
        <div className="text-center">
          <img src="/HMSTR-official-logo.png" alt="HMSTR.ai Logo" className="mx-auto h-24" />
        </div>
        {/* Replace your form with Clerk's SignIn component */}
        <SignIn
          path="/lock-screen"
          routing="path"
          signUpUrl="/sign-up" // Redirect to sign-up if user clicks "Sign up" (add page in Step 7)
          afterSignInUrl="/" // Redirect to dashboard on success
          appearance={{
            elements: {
              formButtonPrimary: "bg-orange-600 hover:bg-orange-800 text-white", // Match your button style
            },
          }}
        />
      </div>
    </div>
  );
}