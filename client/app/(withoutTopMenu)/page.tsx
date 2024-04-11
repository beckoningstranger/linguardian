import Link from "next/link";

export default function Root() {
  return (
    <div className="flex flex-col">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="https://localhost:8000/auth/google">Login with Google</Link>
    </div>
  );
}
