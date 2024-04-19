import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
  }
}
