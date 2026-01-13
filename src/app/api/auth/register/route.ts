import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/backend/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await userService.createUser(email, password, name);

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create user",
      },
      { status: 500 }
    );
  }
}
