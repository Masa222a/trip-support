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
    <div>
      <Header />
      {posts.map((item, index) => (
        <div key={index} className="border rounded p-4 shadow mt-4">
          {/* <div key={index} className="border rounded p-4 shadow"> */}
            <p key={index}>
            {/* departure_point, 
            arrival_point,
            fp
            flight_time,
            departure_at,
            arrival_at,
            base_price,
            logo_url,
            tax_price,
            total_price */}
              出発地: {item.Post.departure_point}<br />
              到着地: {item.Post.arrival_point}<br />
              出発時刻: {item.Post.departure_at}<br />
              到着時刻: {item.Post.arrival_at}<br />              
              トータル: {item.Post.total_price}<br />
              税金: {item.Post.tax_price}<br />
              ベース: {item.Post.base_price}
            </p>
        </div>
      ))}
    </div>
  )
}
