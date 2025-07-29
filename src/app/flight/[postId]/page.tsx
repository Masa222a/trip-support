"use client"
import { useRouter } from 'next/navigation' 
import Link from "next/link";
import Header from '@/app/components/layouts/header/header';

const FlightDetailPage = () => {
  const router = useRouter()

  return (
    <div className="max-w-3xl mx-auto bg-white my-4 rounded-xl shadow-lg p-6 space-y-6">
      {/* ヘッダー */}
      <Header />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">バンコク</h1>
        <p className="text-sm text-gray-500">旅行者1名・往復・エコノミークラス</p>
      </div>

      {/* 出発 */}
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2">出発 2025年6月26日 (木)</h2>
        <div className="border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <img src="#" alt="タイ・エアアジアX" className="h-6" />
            <p className="text-sm font-medium text-gray-600">タイ・エアアジアX</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div>
              <p className="text-lg font-semibold">21:00</p>
              <p>KIX</p>
            </div>
            <div className="text-center">
              <p>6時間30分</p>
              <p className="text-xs text-green-600">直行便</p>
            </div>
            <div>
              <p className="text-lg font-semibold">1:30<span className="text-xs">+1</span></p>
              <p>DMK</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">到着：2025年6月27日 (金)</p>
        </div>
      </div>

      {/* 復路 */}
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2">復路 2025年7月3日 (木)</h2>
        <div className="border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <img src="/airasia-logo.png" alt="タイ・エアアジアX" className="h-6" />
            <p className="text-sm font-medium text-gray-600">タイ・エアアジアX</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div>
              <p className="text-lg font-semibold">12:05</p>
              <p>DMK</p>
            </div>
            <div className="text-center">
              <p>5時間25分</p>
              <p className="text-xs text-green-600">直行便</p>
            </div>
            <div>
              <p className="text-lg font-semibold">19:30</p>
              <p>KIX</p>
            </div>
          </div>
        </div>
      </div>

      {/* 料金詳細 */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-bold text-gray-800">料金の詳細</h3>
        <div className="flex justify-between text-sm text-gray-700">
          <p>航空券代金</p>
          <p>¥38,000</p>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <p>税金・手数料</p>
          <p>¥5,000</p>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900 mt-2">
          <p>合計金額</p>
          <p>¥43,000</p>
        </div>
      </div>
      <Link href="#" onClick={() => {router.back()}} className="text-blue-500">
        戻る
      </Link>
    </div>
  )
}

export default FlightDetailPage
