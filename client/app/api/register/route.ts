import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getNextUserId } from "@/app/actions";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await getNextUserId();
    await connectMongoDB();
    await User.create({
      id: "credentials" + id,
      username,
      email,
      password: hashedPassword,
    });
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occured while registering the user." },
      { status: 500 }
    );
  }
}
