import Link from "next/link";

import Logo from "@/components/Logo";
import paths from "@/lib/paths";
import RegisterAndSignInLinks from "./RegisterAndSignInLinks";

export default function LandingPageMenu() {
  return (
    <header>
      <nav className="flex items-baseline justify-between bg-white/20 px-4 py-8 tablet:px-12">
        <Link href={paths.rootPath()}>
          <Logo />
        </Link>
        <RegisterAndSignInLinks />
      </nav>
    </header>
  );
}
