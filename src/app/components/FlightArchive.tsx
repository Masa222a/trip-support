"use client"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState } from "react";


export default function FlightArchive() {
  const [filterType, setFilterType] = useState("cheapest")
  return (
    <div className="relative z-20 -mt-20 px-4">
      <div className="mx-auto max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl">
        <Tabs defaultValue="cheapest" onValueChange={setFilterType}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cheapest">最安プラン</TabsTrigger>
            <TabsTrigger value="shortest">最短プラン</TabsTrigger>
          </TabsList>
        </Tabs>
        </div>
    </div>
  )
}

