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
import React, { useState } from "react";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import FlightArchive from "./FlightArchive";
import dayjs from 'dayjs';
import flightData from '../../../data/flightData'
import { FlightListInterface } from '@/types/FlightList'
import Link from "next/link";
import Image from 'next/image'
import { createClient } from "@/lib/supabase/client";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FlightSearch() {
  const [tripType, setTripType] = useState("round")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [from, setFrom] = useState<string>()
  const [to, setTo] = useState<string>()
  const [dDate] = useState<Date>()
  const [rDate] = useState<Date>()
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlightListInterface[]>([]);

  const toggleFavorite = async (id: number) => {
    setResult(result.map((res, index) => {
      if (id == index) {
        console.log(id)
        return {
          ...res,
          isFavorite: !res.isFavorite
        }
      } else {
        console.log("else")
        return res
      }
    }))
    const user_id = await supabase.auth.getUser()
    console.log(`login user: ${user_id}`)
    console.log(JSON.stringify(user_id))
    const res = await supabase
    .from('Post')
    .insert({
      user_id: user_id,
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
  };

  const dHours = Array.from({ length: 24 }, (_, i) => i)
  const rHours = Array.from({ length: 24 }, (_, i) => i)

  const handleDepartureDateSelect = (departureDate: Date | undefined) => {
    if (departureDate) {
      setDepartureDate(departureDate)
    }
  }

  const handleDepartureTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (!departureDate) {
      return;
    }
    const newDepartureDate = new Date(departureDate);
    if (type === "hour") {
      newDepartureDate.setHours(parseInt(value));
    } else if (type === "minute") {
      newDepartureDate.setMinutes(parseInt(value));
    }
    setDepartureDate(newDepartureDate);
  }

  const handleReturnDateSelect = (returnDate: Date | undefined) => {
    if (returnDate) {
      setReturnDate(returnDate)
    }
  }

  const handleReturnTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (!returnDate) {
      return;
    }
    const newReturnDate = new Date(returnDate);
    if (type === "hour") {
      newReturnDate.setHours(parseInt(value));
    } else if (type === "minute") {
      newReturnDate.setMinutes(parseInt(value));
    }
    setReturnDate(newReturnDate);
  }

  const callAPI = async () => {
    setLoading(true)
    setResult([])
    // const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId={from}.AIRPORT&toId={to}.AIRPORT&departDate=2025-06-13&returnDate=2025-06-20&stops=none&pageNo=1&adults=1&children=0%2C17&sort=CHEAPEST&cabinClass=ECONOMY&currency_code=JPY`;
    // const url = 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=KIX.AIRPORT&toId=BKK.AIRPORT&departDate=2025-12-12&returnDate=2025-12-20&stops=none&pageNo=1&adults=1&children=0%2C17&sort=CHEAPEST&cabinClass=ECONOMY&currency_code=JPY'
    // const apiKey = '00f2ce223fmsh839dbcfe2809209p199576jsna9c13a41c967'
    // const host = 'booking-com15.p.rapidapi.com'
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

      // const data = JSON.parse(jsonData);
      // const items = flightData.flightOffers || []
      const items = flightData.data.flightOffers || []

      console.log(JSON.stringify(flightData, null, 2)) 
      // console.log(JSON.stringify(flightData, null, 2)) 

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
            isFavorite: false,
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

  return (
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
                  <Input 
                    id="from" 
                    name="from" 
                    placeholder="東京（羽田/成田）" 
                    className="mt-1" 
                    required 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="to" className="text-gray-700">目的地</Label>
                  <Input 
                    id="to" 
                    name="to" 
                    placeholder="大阪（関西）" 
                    className="mt-1" 
                    required 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
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
                          format(departureDate, 'yyyy/MM/dd HH:mm')
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
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {dHours.reverse().map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={dDate && dDate.getHours() == hour ? "default" : "ghost"}
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleDepartureTimeChange("hour", hour.toString())}
                                >
                                  {hour}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length:12 },(_, i) => i * 5).map((minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={dDate && dDate.getMinutes() == minute ? "default" : "ghost"}
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleDepartureTimeChange("minute", minute.toString())}
                                >
                                  {minute.toString().padStart(2, '0')}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                        </div>
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
                          format(returnDate, 'yyyy/MM/dd HH:mm')
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
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {rHours.reverse().map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={rDate && rDate.getHours() == hour ? "default" : "ghost"}
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleReturnTimeChange("hour", hour.toString())}
                                >
                                  {hour}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length:12 },(_, i) => i * 5).map((minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={dDate && dDate.getMinutes() == minute ? "default" : "ghost"}
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleReturnTimeChange("minute", minute.toString())}
                                >
                                  {minute.toString().padStart(2, '0')}
                                </Button>
                              ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                )}

                <div>
                  <Label htmlFor="passengers" className="text-gray-700">搭乗者数</Label>
                  <Select defaultValue="1">
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
                type="submit"
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
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-bold">検索結果</h2>
                  {result.map((res, index) => {
                    const segment = res; // 最初のセグメントを表示（直行便）
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
                        <p><strong>税金:</strong> {segment.taxPrice}</p>
                        <p><strong>ベース:</strong> {segment.basePrice}</p>
                        <Link href={`/flight/${index}`} className="text-blue-500">
                          Read More
                        </Link>

                        {/* Favoriteボタン右寄せ部分 */}
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
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
