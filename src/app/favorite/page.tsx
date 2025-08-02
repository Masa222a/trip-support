"use client"

import { Trash2 } from 'lucide-react';
import { useState } from 'react'
import Header from '../components/layouts/header/header';

const favoritePage = () => {
  const [isFavorited, setIsFavorited] = useState(true);
  const [deleteFlag, setDeleteFlag] = useState(false)

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };
  
  return (
    <div>
      <Header />
      <button
        type="button"
        className="ml-4 mt-4 rounded bg-gray-200 p-2 transition-colors hover:bg-gray-300"
      >
      <Trash2 className="size-5 text-gray-500" />
      </button>
      <div className="border rounded p-4 shadow mt-4">
        {/* <div key={index} className="border rounded p-4 shadow"> */}
          <p><strong>出発地:</strong>大阪</p>
          <p><strong>到着地:</strong>バンコク</p>
          <p><strong>出発時刻:</strong>12/12</p>
          <p><strong>到着時刻:</strong>12/20</p>
          <p><strong>フライト時間:</strong>7時間</p>
          {/* {segment.logoUrl ?
            <Image src={segment.logoUrl} width={50} height={50} alt="logo" /> :
            "不明"
          } */}
          <p><strong>トータル:</strong>43,000</p>
          <p><strong>税金:</strong>4,300</p>
          <p><strong>ベース:</strong>38,700</p>
          {/* <Link href={`/flight/${index}`} className="text-blue-500">
            Read More
          </Link> */}
      </div>
      <div className="border rounded p-4 shadow">
        {/* <div key={index} className="border rounded p-4 shadow"> */}
          <p><strong>出発地:</strong>大阪</p>
          <p><strong>到着地:</strong>バンコク</p>
          <p><strong>出発時刻:</strong>12/12</p>
          <p><strong>到着時刻:</strong>12/20</p>
          <p><strong>フライト時間:</strong>7時間</p>
          {/* {segment.logoUrl ?
            <Image src={segment.logoUrl} width={50} height={50} alt="logo" /> :
            "不明"
          } */}
          <p><strong>トータル:</strong>43,000</p>
          <p><strong>税金:</strong>4,300</p>
          <p><strong>ベース:</strong>38,700</p>
          {/* <Link href={`/flight/${index}`} className="text-blue-500">
            Read More
          </Link> */}
      </div>
    </div>
  )
}

export default favoritePage
