"use client"

import { useEffect, useState } from 'react'
import Header from '../components/layouts/header/header';
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

type Post = {
  id: number
  departure_point: string
  flight_time: string
  departure_at: string
  arrival_at: string
  arrival_point: string
  base_price: string
  logo_url: string
  tax_price: string
  total_price: string
}

type FavoriteWithPost = {
  Post: Post[]
}

export default function FavoritePage() {
  const [posts, setPosts] = useState<FavoriteWithPost[]>([])
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
  
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("本当に削除しますか？");
    if (!confirmed) return;
  
    const { error } = await supabase
      .from("Favorite")
      .delete()
      .eq("post_id_arrival", id); // ここも id を直接使う
  
    if (!error) {
      setPosts((prev) => prev.filter((item) => item.Post.id !== id));
    } else {
      alert("削除に失敗しました");
    }
  };
  

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
              <Image
                src={item.Post.logo_url}
                alt="航空会社ロゴ"
                width={40}
                height={40}
                className="object-contain"
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

          {/* 下部: 削除ボタン */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => handleDelete(item.Post.id)}
              className="bg-red-500 text-black text-sm px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              削除ボタン
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
