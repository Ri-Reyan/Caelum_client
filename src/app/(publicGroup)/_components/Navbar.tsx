import Image from "next/image";
import Link from "next/link";
import icon from "../../icon.png";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            height={36}
            width={36}
            src={icon}
            alt="Logo"
            className="object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Caelum
          </span>
        </Link>

        {/* Right Navigation / Profile CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/customer/dashboard"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
