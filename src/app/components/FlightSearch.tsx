"use client"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import dayjs from 'dayjs';
import { FlightListInterface } from '@/types/FlightList'
import Image from 'next/image'
import { createClient } from "@/lib/supabase/client"
import Header from "./layouts/header/header"
import flightData from '../../../data/flightData'
import FlightDetailModal from "./FlightDetailModal";

export default function FlightSearch() {
  const [tripType, setTripType] = useState("round")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [from, setFrom] = useState<string>()
  const [to, setTo] = useState<string>()
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlightListInterface[]>([]);
  const [status, setStatus] = useState("")
  const [tokens, setToken] = useState([])
  const [passenger, setPassenger] = useState("")
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightListInterface | null>(null)

  const supabase = createClient()
  useEffect(() => {
    (async() => {
      const { data } = await supabase.auth.getUser()
      if (data.user != null) {
        setStatus(data.user.id)
      } else {
        setStatus("")
      }

      const favData = await supabase
      .from("Favorite")
      .select("*")
      .not('token', 'is', null)
      if (favData.data != null) {
        const tokenArray = favData.data
        .filter(item => item.token)
        .map(item => item.token);
        setToken(tokenArray)
      } else {
        setToken([])
      }

    })()
  }, [])

  const toggleFavorite = async (id: number) => {
    setResult(result.map((res, index) => {
      if (id == index) {
        return {
          ...res,
          isFavorite: !res.isFavorite
        }
      } else {
        return res
      }
    }))
    const { data } = await supabase.auth.getUser()
    // 取得までの時間をローディングさせるように新しく作成
    const postData = await supabase
    .from('Post')
    .insert({
      user_id: data.user.id,
      departure_point: result[id].departureAirport,
      arrival_point: result[id].arrivalAirport,
      flight_time: result[id].duration,
      total_price: result[id].totalPrice,
      logo_url: result[id].logoUrl,
      tax_price: result[id].taxPrice,
      base_price: result[id].basePrice,
      departure_at: result[id].departureTime,
      arrival_at: result[id].arrivalTime
    })
    .select()
    
    const favoriteData = await supabase
    .from('Favorite')
    .insert({
      user_id: data.user.id,
      post_id_arrival: postData.data[0].id,
      post_id_departure: null,
      token: result[id].token
    })
  };

  const handleDepartureDateSelect = (departureDate: Date | undefined) => {
    if (!departureDate) return
    
    const formattedDate = departureDate.toISOString().split("T")[0];
    setDepartureDate(formattedDate)
  }

  const handleReturnDateSelect = (returnDate: Date | undefined) => {
    if (!returnDate) return
    
    const formattedDate = returnDate.toISOString().split("T")[0];
    setReturnDate(formattedDate)
  };

  const callAPI = async () => {
    setLoading(true)
    setResult([])

    // let url = ""
    // if (tripType == 'round') {
    //   url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=${from}.AIRPORT&toId=${to}.AIRPORT&departDate=${departureDate}&returnDate=${returnDate}&stops=none&pageNo=1&adults=${passenger}&children=0%2C17&sort=CHEAPEST&cabinClass=ECONOMY&currency_code=JPY`;
    // } else {
    //   url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=${from}.AIRPORT&toId=${to}.AIRPORT&departDate=${departureDate}&stops=none&pageNo=1&adults=${passenger}&children=0%2C17&sort=CHEAPEST&cabinClass=ECONOMY&currency_code=JPY`;
    // }
    // const apiKey = process.env.RAPIDAPI_KEY
    // const host = process.env.RAPIDAPI_HOST

    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'X-RapidAPI-Key': apiKey!,
    //     'X-RapidAPI-Host': host!
    //   }
    // };
    try {
      // const res = await fetch(url, options);
      // const flightData = await res.json();

      const items = flightData.data.flightOffers || []

      const flightList:FlightListInterface[] = []
      // typeやモデルを定義して、それを元にデータの受け渡しを行う
      items.forEach((item: any) => {
        item.segments.forEach((segment: any, segIndex: number) => {
          const durationSeconds = segment.totalTime || 0;
          const hours = Math.floor(durationSeconds / 3600);
          const minutes = Math.floor((durationSeconds % 3600) / 60);
          const duration = `${hours}時間${minutes}分`
          const logo = segment.legs[0].carriersData[0].logo;
          // api側で梱包まで行うのが良い
          const totalPrice = item.travellerPrices?.[0].travellerPriceBreakdown?.total.units.toLocaleString()
          const basePrice =  item.travellerPrices?.[0].travellerPriceBreakdown?.baseFare.units.toLocaleString()
          const taxPrice =  item.travellerPrices?.[0].travellerPriceBreakdown?.tax.units.toLocaleString()
          const isFavorite = tokens.includes(item.token)

          flightList.push({
            id: segIndex,
            departureAirport: segment.departureAirport?.name || '不明',
            arrivalAirport: segment.arrivalAirport?.name || '不明',
            departureTime: dayjs(segment.departureTime).format('YYYY/MM/DD HH:mm'),
            arrivalTime: dayjs(segment.arrivalTime).format('YYYY/MM/DD HH:mm'),
            duration: duration,
            logoUrl: logo,
            totalPrice: totalPrice,
            basePrice: basePrice,
            taxPrice: taxPrice,
            isFavorite: isFavorite,
            token: item.token
          })
        })
      })

      setResult(flightList)
    } catch (error) {
      console.error("API error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePassengers = (p: string) => {
    setPassenger(p)
  }

  const openModal = (flight: FlightListInterface) => {
    console.log(`flight: ${JSON.stringify(flight)}`)
    // const detailFlight = JSON.stringify(flight)
    setSelectedFlight(flight);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFlight(null);
  };

  return (
    <div>
      <Header />
      <div className="relative bg-cover bg-center min-h-[70vh]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 py-20">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">最安値で航空券を予約</h1>
          <p className="text-lg md:text-xl font-light">簡単・手軽にチケットを検索</p>
        </div>

        {/* フォームセクション */}
        <div className="relative z-20 -mt-20 px-4">
          <div className="mx-auto max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
            <Tabs defaultValue="round" onValueChange={setTripType}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="round">往復</TabsTrigger>
                <TabsTrigger value="oneway">片道</TabsTrigger>
              </TabsList>

              <form>
                {/* 出発地と目的地 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="from" className="text-gray-700">出発地</Label>
                    <select
                      id="from"
                      name="from"
                      className="mt-1 border rounded p-2 w-full"
                      required
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    >
                      <option value="">空港を選択してください</option>
                      <option value="HND">羽田空港 (東京) - HND</option>
                      <option value="NRT">成田国際空港 (千葉) - NRT</option>
                      <option value="KIX">関西国際空港 (大阪) - KIX</option>
                      <option value="ITM">大阪国際空港（伊丹）- ITM</option>
                      <option value="NGO">中部国際空港 (愛知) - NGO</option>
                      <option value="CTS">新千歳空港 (北海道) - CTS</option>
                      <option value="SDJ">仙台空港 (宮城) - SDJ</option>
                      <option value="FUK">福岡空港 (福岡) - FUK</option>
                      <option value="OKA">那覇空港 (沖縄) - OKA</option>
                      <option value="KOJ">鹿児島空港 (鹿児島) - KOJ</option>
                      <option value="HIJ">広島空港 (広島) - HIJ</option>
                      <option value="TAK">高松空港 (香川) - TAK</option>
                      <option value="MYJ">松山空港 (愛媛) - MYJ</option>
                      <option value="KMJ">熊本空港 (熊本) - KMJ</option>
                      <option value="KMQ">小松空港 (石川) - KMQ</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="to" className="text-gray-700">目的地</Label>
                    <select
                      id="to"
                      name="to"
                      className="mt-1 border rounded p-2 w-full"
                      required
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    >
                      <option value="">空港を選択してください</option>
                      <option value="HND">羽田空港 (東京) - HND</option>
                      <option value="NRT">成田国際空港 (千葉) - NRT</option>
                      <option value="KIX">関西国際空港 (大阪) - KIX</option>
                      <option value="ITM">大阪国際空港（伊丹）- ITM</option>
                      <option value="NGO">中部国際空港 (愛知) - NGO</option>
                      <option value="CTS">新千歳空港 (北海道) - CTS</option>
                      <option value="SDJ">仙台空港 (宮城) - SDJ</option>
                      <option value="FUK">福岡空港 (福岡) - FUK</option>
                      <option value="OKA">那覇空港 (沖縄) - OKA</option>
                      <option value="KOJ">鹿児島空港 (鹿児島) - KOJ</option>
                      <option value="HIJ">広島空港 (広島) - HIJ</option>
                      <option value="TAK">高松空港 (香川) - TAK</option>
                      <option value="MYJ">松山空港 (愛媛) - MYJ</option>
                      <option value="KMJ">熊本空港 (熊本) - KMJ</option>
                      <option value="KMQ">小松空港 (石川) - KMQ</option>
                    </select>
                  </div>
                </div>

                {/* 日付と人数 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="departure-date" className="text-gray-700">出発日</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        {/* departureDateがからでなければ日付を表示 */}
                        <Button variant="outline" className="w-full mt-1 text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? (
                            format(departureDate, 'yyyy/MM/dd')
                          ): (
                            <span>日付を選択</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="sm:flex">
                          <Calendar 
                            mode="single"
                            selected={departureDate}
                            onSelect={handleDepartureDateSelect}
                            initialFocus
                            disabled={(departureDate) => departureDate < new Date()}
                            className="rounded-md border" />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {tripType == "round" && (
                    <div>
                    <Label htmlFor="departure-date" className="text-gray-700">帰国日</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        {/* departureDateがからでなければ日付を表示 */}
                        <Button variant="outline" className="w-full mt-1 text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? (
                            format(returnDate, 'yyyy/MM/dd')
                          ): (
                            <span>日付を選択</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="sm:flex">
                          <Calendar 
                            mode="single"
                            selected={returnDate}
                            onSelect={handleReturnDateSelect}
                            initialFocus
                            disabled={(returnDate) => returnDate < new Date()}
                            className="rounded-md border" />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  )}

                  <div>
                    <Label htmlFor="passengers" className="text-gray-700">搭乗者数</Label>
                    <Select onValueChange={handlePassengers} defaultValue="1">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="搭乗者数を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1名</SelectItem>
                        <SelectItem value="2">2名</SelectItem>
                        <SelectItem value="3">3名</SelectItem>
                        <SelectItem value="4">4名</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 検索ボタン */}
                <Button 
                  type="button"
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg"
                  onClick={() => {
                      callAPI()
                  }}>
                    {loading ? "検索中..." : "検索する"}
                </Button>
                {loading && !result && (
                  <p className="text-gray-600 text-center mt-4">フライトを検索中です...</p>
                )}
                {!loading && result.length > 0 && (
                  <div className="mt-6 space-y-6">
                    <h2 className="text-xl font-bold">検索結果</h2>

                    {tripType === "oneway" && (
                      // 片道 → 現状のまま
                      result.map((res, index) => {
                        const segment = res;
                        if (!segment) return null;
                        return (
                          <div key={index} className="border rounded p-4 shadow">
                            {segment.logoUrl ?
                              <Image src={segment.logoUrl} width={50} height={50} alt="logo" /> :
                              "不明"
                            }
                            <p><strong>出発地:</strong> {segment.departureAirport}</p>
                            <p><strong>到着地:</strong> {segment.arrivalAirport}</p>
                            <p><strong>出発時刻:</strong> {segment.departureTime}</p>
                            <p><strong>到着時刻:</strong> {segment.arrivalTime}</p>
                            <p><strong>フライト時間:</strong> {segment.duration}</p>
                            <p><strong>トータル:</strong> {segment.totalPrice}</p>
                            
                            <button 
                              onClick={() => openModal(segment)}
                              className="mt-4 px-2 py-2 bg-blue-200 border border-blue-300 text-blue-700 rounded hover:bg-blue-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                              詳細を見る
                            </button>
                          
                            {status && 
                              <div className="flex justify-end mt-2 mb-4">
                                <button
                                  onClick={() => toggleFavorite(index)}
                                  className={`flex items-center gap-1 px-3 py-1 rounded transition-colors duration-200 ${
                                    segment.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
                                  }`}
                                >
                                  Favorite
                                </button>
                              </div>
                            }
                          </div>
                        );
                      })
                    )}

                    {tripType === "round" && (
                      <div className="space-y-6">
                        {result.reduce((pairs: { flights: FlightListInterface[], startIndex: number }[], _, i) => {
                          if (i % 2 === 0) pairs.push({ flights: result.slice(i, i + 2), startIndex: i });
                          return pairs;
                        }, []).map((pair, setIndex) => {
                          // 合計金額計算
                          const totalSum = pair.flights.reduce((sum, flight) => {
                            const price = flight.totalPrice ? parseInt(flight.totalPrice.replace(/,/g, "")) : 0;
                            return sum + price;
                          }, 0);
                          
                          return (
                            <div key={setIndex} className="border rounded-lg p-4 shadow bg-white">
                              <h3 className="font-bold text-lg mb-4">往復セット {setIndex + 1}</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {pair.flights.map((res, idx) => {
                                  const globalIndex = pair.startIndex + idx
                                  return (
                                    <div key={idx} className="border rounded p-4 bg-gray-50">
                                      <div className="flex items-center gap-3 mb-2">
                                        <Image src={res.logoUrl || "/no-logo.png"} width={40} height={40} alt="logo" />
                                        <p className="font-semibold">{res.departureAirport} → {res.arrivalAirport}</p>
                                      </div>
                                      <p><strong>出発:</strong> {res.departureTime}</p>
                                      <p><strong>到着:</strong> {res.arrivalTime}</p>
                                      <p><strong>所要時間:</strong> {res.duration}</p>
                                      <p><strong>料金:</strong> {res.totalPrice}円</p>

                                      {/* お気に入りボタン */}
                                      {status && (
                                        <div className="flex justify-end mt-3">
                                          <button
                                            onClick={() => toggleFavorite(globalIndex)}
                                            className={`px-3 py-1 rounded ${
                                              res.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
                                            }`}
                                          >
                                            Favorite
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {/* 合計金額表示 */}
                              <p className="mt-4 text-right font-bold text-lg">
                                往復合計: {totalSum.toLocaleString()}円
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <FlightDetailModal
                      isOpen={modalIsOpen}
                      onRequestClose={closeModal}
                      flightData={selectedFlight}
                    />
                  </div>
                )}
              </form>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
