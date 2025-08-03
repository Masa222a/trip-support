"use client"

import { useEffect, useState } from 'react'
import Header from '../components/layouts/header/header';
import { createClient } from "@/lib/supabase/client"


export default function favoritePage() {
  const [posts, setPosts] = useState([])
  const supabase = createClient()
  useEffect(() => {
    (async() => {
      const userData = await supabase.auth.getUser()
      if (userData.data.user?.id) {
        const favoriteData = await supabase
        .from("Favorite")
        .select("Post:post_id_arrival(id, departure_point, flight_time, departure_at, arrival_at, arrival_point, base_price, logo_url, tax_price, total_price)")
        .eq("user_id", userData.data.user?.id)
        console.log(`--お気に入りのデータ:${JSON.stringify(favoriteData.data)}`)
        
        if (favoriteData.data) {
          setPosts(favoriteData.data)
        } else {
          setPosts([])
        }
      }
    })()
  }, [])  
  
  return (
    <div className="px-4">
      <Header />
      {posts.map((item, index) => (
        <div
          key={index}
          className="border rounded-2xl shadow-md p-6 mt-6 bg-white hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">
                {item.Post.departure_point} → {item.Post.arrival_point}
              </h2>
              <p className="text-sm text-gray-500">
                出発: {item.Post.departure_at} | 到着: {item.Post.arrival_at}
              </p>
            </div>
            {item.Post.logo_url && (
              <img
                src={item.Post.logo_url}
                alt="航空会社ロゴ"
                className="h-10 w-auto object-contain"
              />
            )}
          </div>
  
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
            <div className="font-medium">ベース価格:</div>
            <div>¥{item.Post.base_price}</div>
            <div className="font-medium">税金:</div>
            <div>¥{item.Post.tax_price}</div>
            <div className="font-medium">トータル価格:</div>
            <div className="text-red-600 font-bold">¥{item.Post.total_price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
