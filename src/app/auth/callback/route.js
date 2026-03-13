import { NextResponse } from "next/server";
import { signIn } from "@/auth";
 
export async function GET(request) {
  const token = request.cookies.get("jwt")?.value;
 
  if (!token) {
    return NextResponse.redirect(new URL("/?error=no_token", request.url));
  }
 
  try {
    await signIn("jwt", { token, redirect: false });
 
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", request.url)
    );
  }
}