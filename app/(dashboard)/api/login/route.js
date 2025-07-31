import { NextResponse } from "next/server";

export async function POST(request) {
  const { user, password } = await request.json();

  if (!user || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  if (user === "admin" && password === "123") {
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("authToken", "hardcoded-session-token", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });
  return response;
}

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
