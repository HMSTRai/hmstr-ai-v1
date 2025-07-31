"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LockScreen() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      if (res.ok) {
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 3000,
        });
        window.location.href = "/";
      } else {
        const data = await res.json();
        toast.error(data.error || "Login failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src="/HMSTR-official-logo.png" alt="HMSTR.ai Logo" className="mx-auto h-24" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-3 text-sm text-gray-600">
            Sign in to your account to start using HMSTR.ai Dashboard
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
