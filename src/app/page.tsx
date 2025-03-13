"use client";

import downloadData from "@/lib/downloadData";
import getRoommates, { Roommate } from "@/lib/getRoommates";
import updateData from "@/lib/updateData";
import { useState } from "react";

// [TODO] Import data from csv
// [TODO] Implement data saving
// [TODO] Implement data downloading

export default function Home() {
  const hostels = ["Garnet A", "Garnet B"];
  const roomsPerHostel = new Array(121).fill(0).map((_, index) => index + 1);
  const [selectedRoom, setSelectedRoom] = useState<{
    hostel: string;
    room: number;
  } | null>(null);
  const [roommates, setRoommates] = useState<Roommate[] | null>(null);
  const [collapsed, setCollapsed] = useState<number[]>([1, 1]);

  return (
    <div className="m-12 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-center text-3xl font-bold">
        NITT Hostel Roll Call System
        <h2 className="mt-2 text-xs text-gray-300">
          Made with ❤️ by Jayanth Ramesh Kumar
        </h2>
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {hostels.map((hostel) => (
          <div key={hostel}>
            <button
              className="flex items-center"
              onClick={() => {
                const index = hostels.indexOf(hostel);
                setCollapsed((prev) => {
                  const newCollapsed = [...prev];
                  newCollapsed[index] = !newCollapsed[index] ? 1 : 0;
                  return newCollapsed;
                });
              }}
            >
              <h1 className="mb-3 cursor-pointer text-2xl font-bold">
                {hostel}
              </h1>
              {collapsed[hostels.indexOf(hostel)] === 0 ? (
                <div className="mb-3 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </svg>
                </div>
              ) : (
                <div className="mb-3 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                  </svg>
                </div>
              )}
            </button>
            {collapsed[hostels.indexOf(hostel)] === 0 ? null : (
              <>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
                  {roomsPerHostel.map((room) => (
                    <button
                      key={room}
                      className="cursor-pointer rounded bg-red-500 p-4 font-bold hover:bg-red-600"
                      onClick={() => {
                        setSelectedRoom({ hostel, room });
                        setRoommates(getRoommates({ hostel, room }));
                      }}
                    >
                      Room {room}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <button
                    className="mt-4 w-xs cursor-pointer rounded bg-white px-4 py-2 font-semibold text-black hover:bg-gray-300 sm:w-sm md:w-md lg:w-lg"
                    onClick={() => downloadData(hostel, false)}
                  >
                    Download {hostel} Data
                  </button>
                  <button
                    className="mt-2 w-xs cursor-pointer rounded bg-red-500 px-4 py-2 font-semibold hover:bg-red-600 sm:w-sm md:w-md lg:w-lg"
                    onClick={() => downloadData(hostel, true)}
                  >
                    Download {hostel} Absentees Data
                  </button>
                </div>
                <hr className="mt-8" />
              </>
            )}
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded bg-black p-6">
            <h3 className="mb-4 text-2xl font-bold">
              {selectedRoom.hostel} - Room {selectedRoom.room}
            </h3>
            <div className="space-y-2">
              {roommates?.map((roommate) => (
                <div key={roommate.rollNumber}>
                  <button
                    className={`cursor-pointer rounded p-2 font-medium ${
                      roommate.rollCall
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                    onClick={() => {
                      roommate.rollCall = !roommate.rollCall;
                      setRoommates([...roommates!]);
                      updateData(roommates!);
                    }}
                  >
                    {roommate.name}: {roommate.rollNumber}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedRoom(null);
                setRoommates(null);
              }}
              className="mt-4 cursor-pointer rounded bg-blue-500 px-4 py-2 font-semibold hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col items-center">
        <button
          className="mt-4 w-xs cursor-pointer rounded bg-white px-4 py-2 font-semibold text-black hover:bg-gray-300 sm:w-sm md:w-md lg:w-lg"
          onClick={() => downloadData("All", false)}
        >
          Download All Hostel Data
        </button>
        <button
          className="mt-2 w-xs cursor-pointer rounded bg-red-500 px-4 py-2 font-semibold hover:bg-red-600 sm:w-sm md:w-md lg:w-lg"
          onClick={() => downloadData("All", true)}
        >
          Download All Absentees Data
        </button>
      </div>
    </div>
  );
}
