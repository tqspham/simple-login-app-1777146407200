import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

const VALID_CREDENTIALS = {
  email: "demo@example.com",
  password: "password123",
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  const body: LoginRequest = await request.json();
  const { email, password } = body;

  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Invalid email or password" },
    { status: 401 }
  );
}
