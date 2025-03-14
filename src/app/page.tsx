"use client";

import DownloadCSV from "@/components/DownloadCSV";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";

interface Roommate {
  name: string;
  rollNumber: string;
  hostel: string;
  room: number;
  rollCall: boolean;
}

export interface HostelData {
  [hostel: string]: { [room: number]: Roommate[] };
}

export default function Home() {
  const hostels = ["Garnet A", "Garnet B"];
  const roomsPerHostel = new Array(121).fill(0).map((_, index) => index + 1);
  const [hostelData, setHostelData] = useState<HostelData>({});

  const [selectedRoom, setSelectedRoom] = useState<{
    hostel: string;
    room: number;
  } | null>(null);
  const [roommates, setRoommates] = useState<Roommate[] | null>(null);

  const [collapsed, setCollapsed] = useState([1, 1]);
  const [isDataImported, setIsDataImported] = useState(false);

  const { CSVReader } = useCSVReader();

  const isRoomPresent = (hostel: string, room: number) => {
    return hostelData[hostel][room]
      ? hostelData[hostel][room].every((roommate) => roommate.rollCall)
      : false;
  };

  return (
    <div className="m-12 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-3xl font-bold">
          Garnet Roll Call System
        </h1>
        <h2 className="mt-2 text-xs text-gray-300">
          Made with ❤️ by Jayanth Ramesh Kumar
        </h2>
      </div>
      <CSVReader
        // eslint-disable-next-line
        onUploadAccepted={(results: any) => {
          results = results.data.slice(1);
          const data: HostelData = {};

          results.forEach((row: string[]) => {
            const name = row[0].trim();
            const rollNumber = row[1].trim();
            const hostel = row[2].trim();
            const room = parseInt(row[3].trim(), 10);
            const rollCall = row[4].trim();

            const roommate: Roommate = {
              name,
              rollNumber,
              hostel,
              room,
              rollCall: rollCall === "Present",
            };
            if (!data[hostel]) {
              data[hostel] = {};
            }
            if (!data[hostel][room]) {
              data[hostel][room] = [];
            }
            data[hostel][room].push(roommate);
          });

          setHostelData(data);
          setIsDataImported(true);
        }}
      >
        {/* eslint-disable-next-line */}
        {({ getRootProps }: any) => (
          <div className="flex flex-col items-center">
            <button
              className="mt-6 w-xs cursor-pointer rounded bg-white px-4 py-2 font-semibold text-black hover:bg-gray-300 sm:w-sm md:w-md lg:w-lg"
              onClick={() => setIsDataImported(true)}
              {...getRootProps()}
            >
              Import Student Data
            </button>
          </div>
        )}
      </CSVReader>

      {isDataImported ? (
        <>
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
                    {hostel} (
                    {Object.values(hostelData[hostel]).reduce(
                      (count, roommates) =>
                        count +
                        roommates.filter((roommate) => roommate.rollCall)
                          .length,
                      0,
                    )}
                    /
                    {Object.values(hostelData[hostel]).reduce(
                      (total, roommates) => total + roommates.length,
                      0,
                    )}
                    )
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
                          className={`cursor-pointer rounded ${
                            isRoomPresent(hostel, room)
                              ? "bg-green-500 text-black hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          } p-4 font-bold`}
                          onClick={() => {
                            setSelectedRoom({ hostel, room });
                            setRoommates(hostelData[hostel][room]);
                          }}
                        >
                          Room {room}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                      <DownloadCSV
                        data={hostelData}
                        hostel={hostel}
                        absentees={false}
                      />
                      <DownloadCSV
                        data={hostelData}
                        hostel={hostel}
                        absentees={true}
                      />
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
                          setHostelData((prev) => {
                            const newHostelData = { ...prev };
                            newHostelData[selectedRoom.hostel][
                              selectedRoom.room
                            ] = roommates!;
                            return newHostelData;
                          });
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
            <DownloadCSV data={hostelData} hostel="All" absentees={false} />
            <DownloadCSV data={hostelData} hostel="All" absentees={true} />
          </div>
        </>
      ) : null}
    </div>
  );
}
