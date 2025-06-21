"use client"
import React from 'react'
import { useRouter } from 'next/navigation' 
import Link from "next/link";

const FlightDetailPage = () => {
  const router = useRouter()
  
  return (
    <div>
      <p>aaaaaaa</p>
      <Link href="#" onClick={() => {router.back()}} className="text-blue-500">
        戻る
      </Link>
    </div>
  )
}

export default FlightDetailPage
