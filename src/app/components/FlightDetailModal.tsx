import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import { FlightListInterface } from "@/types/FlightList";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  flightData: FlightListInterface | null;
}

export default function FlightDetailModal({ isOpen, onRequestClose, flightData }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`relative z-[99] h-screen w-screen bg-black/80`}
      overlayClassName="fixed inset-0 bg-black_main bg-opacity-60 flex items-center justify-center z-[99]"
      contentLabel="フライト詳細"
      style={{
        content: {
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          backgroundColor: "white"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
      ariaHideApp={false}
    >
      {flightData ? (
        <div>
          <h2 className="text-xl font-bold mb-4">フライト詳細</h2>
          {flightData.logoUrl && (
            <Image src={flightData.logoUrl} width={100} height={100} alt="logo" />
          )}
          <p><strong>出発地:</strong> {flightData.departureAirport}</p>
          <p><strong>到着地:</strong> {flightData.arrivalAirport}</p>
          <p><strong>出発時刻:</strong> {flightData.departureTime}</p>
          <p><strong>到着時刻:</strong> {flightData.arrivalTime}</p>
          <p><strong>フライト時間:</strong> {flightData.duration}</p>
          <p><strong>料金:</strong> {flightData.totalPrice}円</p>
          <p><strong>税金:</strong> {flightData.taxPrice}円</p>
          <p><strong>ベース価格:</strong> {flightData.basePrice}円</p>

          <button
            onClick={onRequestClose}
            className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            閉じる
          </button>
        </div>
      ) : (
        <p>データがありません</p>
      )}
    </Modal>
  );
}
