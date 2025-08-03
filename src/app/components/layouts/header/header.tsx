"use client"
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LogoutButton } from "../../logout-button";
// import { LogoutButton } from "../../logout-button";

const Header = () => {
  const supabase = createClient()
  const [status, setStatus] = useState("")
  useEffect(() => {
    (async() => {
      const { data } = await supabase.auth.getUser()
      // console.log(`----data:${JSON.stringify(data)}`)
      if (data.user != null) {
        setStatus(data.user.id)
      } else {
        setStatus("")
      }
    })()
  }, [])
  


  // console.log(`user status header: ${JSON.stringify(data.user)}`)

  return (
    <div className="divide-y border-gray-200 dark:border-gray-800 border-b">
      <div className="px-4 py-3 md:py-6 lg:px-6">
        <div className="flex items-center justify-between">
          {/* 左側ナビゲーション */}
          {status ?
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
            :
            <nav className="flex items-center space-x-6 text-sm">
              <Link
                className="font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/"
              >
                Home
              </Link>
            </nav>
          }

          {/* 右側 Sign Up */}
            {status ?
                <LogoutButton />
              :
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
            }
        </div>
      </div>
    </div>
  );
};

export default Header;