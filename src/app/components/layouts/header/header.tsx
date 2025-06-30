import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="divide-y border-gray-200 dark:border-gray-800 border-b">
      <div className="px-4 py-3 md:py-6 lg:px-6">
        <div className="flex items-center justify-between">
          {/* 左側ナビゲーション */}
          <nav className="flex items-center space-x-6 text-sm">
            <Link
              className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/"
            >
              Home
            </Link>
            <Link
              className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/chatgpt"
            >
              ChatGPT
            </Link>
            <Link
              className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/favorite"
            >
              Favorite
            </Link>
          </nav>

          {/* 右側 Sign Up */}
          <div>
            <Link
              className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 mr-4"
              href="/auth/sign-up"
            >
              Sign Up
            </Link>
            <Link
              className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/auth/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;