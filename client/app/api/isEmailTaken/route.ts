import { isEmailTaken } from "@/lib/fetchData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const emailIsTaken = await isEmailTaken(email);
    return NextResponse.json(emailIsTaken);
  } catch (err) {
    console.error(err);
  }
}
