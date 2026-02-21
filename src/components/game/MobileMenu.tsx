"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const currentPage = pages.find((page) => page.path === pathname)?.name || "Menu";

  return (
    <div className="relative">
      {/* Current Page Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white bg-gray-800 px-4 py-2 rounded-md"
      >
        {currentPage}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              {page.name}
            </Link>
          ))}
        </div>
      )}

      {/* Language Selector */}
      <div className="mt-4">
        <button
          onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
          className="text-white bg-gray-800 px-4 py-2 rounded-md"
        >
          Language
        </button>

        {languageMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                onClick={() => {
                  // Handle language change logic here
                  setLanguageMenuOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}