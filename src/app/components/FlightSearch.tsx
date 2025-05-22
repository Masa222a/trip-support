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

export default function FlightSearch() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
<div className="relative bg-cover bg-center min-h-[70vh]">
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 py-20">
    <h1 className="text-3xl md:text-5xl font-bold mb-4">最安値で航空券を予約</h1>
    <p className="text-lg md:text-xl font-light">簡単・迅速にお得なチケットを検索</p>
  </div>

  {/* フォームセクション */}
  <div className="relative z-20 -mt-20 px-4">
    <div className="mx-auto max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
      <Tabs defaultValue="round">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="round">往復</TabsTrigger>
          <TabsTrigger value="oneway">片道</TabsTrigger>
        </TabsList>

        <form>
          {/* 出発地と目的地 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="from" className="text-gray-700">出発地</Label>
              <Input id="from" name="from" placeholder="東京（羽田/成田）" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="to" className="text-gray-700">目的地</Label>
              <Input id="to" name="to" placeholder="大阪（関西）" className="mt-1" required />
            </div>
          </div>

          {/* 日付と人数 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="departure-date" className="text-gray-700">出発日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 text-left">
                    日付を選択
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar 
                    mode="single" 
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border" />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="return-date" className="text-gray-700">帰国日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1 text-left">
                    日付を選択
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>

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
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg">
            検索する
          </Button>
        </form>
      </Tabs>
    </div>
  </div>
</div>
  );
}
