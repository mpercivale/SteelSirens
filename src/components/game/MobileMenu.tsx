"use client";

import { useState } from "react";
import Link from "next/link";

const pages = [
  { name: "Home", path: "/" },
  { name: "Characters", path: "/characters" },
  { name: "Bestiary", path: "/bestiary" },
  { name: "Items", path: "/items" },
  { name: "Locations", path: "/locations" },
  { name: "Updates", path: "/updates" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "JP", label: "日本語" },
];

export default function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-md"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black text-white transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-40`}
      >
        <nav className="flex flex-col p-4 space-y-4">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="text-lg font-bold hover:text-gray-400"
              onClick={() => setMenuOpen(false)}
            >
              {page.name}
            </Link>
          ))}
        </nav>

        {/* Language Selector */}
        <div className="mt-8 p-4">
          <h3 className="text-sm font-semibold text-gray-400">Language</h3>
          <div className="flex flex-col space-y-2 mt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="text-lg font-bold hover:text-gray-400 text-left"
                onClick={() => {
                  // Handle language change logic here
                  setMenuOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}