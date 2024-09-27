import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const server = process.env.SERVER_URL;

export async function POST(req: NextRequest) {
  try {
    const { id, username, email, password, image } = await req.json();
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const userToCreate = {
      id: id ? id : "credentials",
      username,
      email,
      hashedPassword,
      image,
    };
    const response = await fetch(`${server}/users/createUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userToCreate),
    });
    if (response.ok)
      return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "An error occured while registering the user." },
      { status: 500 }
    );
  }
}
