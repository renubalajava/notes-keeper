import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-2xl border border-purple-100 bg-white/95 px-5 py-3 shadow-lg shadow-purple-100/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-lg text-white shadow-md shadow-purple-300/40">
              📝
            </div>

            <span className="text-lg font-black tracking-tight text-[#21145f] sm:text-xl">
              Notes <span className="text-violet-600">Keeper</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "text-violet-700"
                    : "text-[#21145f] hover:text-violet-600"
                }`}
              >
                {link.name}

                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 mx-auto h-0.5 rounded-full bg-violet-600" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              to="/login"
              className="rounded-xl border border-violet-200 px-5 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-purple-100 p-2 text-violet-700 sm:hidden"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 border-t border-purple-100 pt-4 sm:hidden">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive(link.path)
                      ? "bg-violet-100 text-violet-700"
                      : "text-[#21145f] hover:bg-violet-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-2 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-violet-200 px-4 py-3 text-center text-sm font-bold text-violet-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;