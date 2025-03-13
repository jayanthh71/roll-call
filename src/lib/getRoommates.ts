export type Roommate = {
  name: string;
  rollNumber: string;
  hostel: string;
  room: number;
  rollCall: boolean;
};

export default function getRoommates({
  hostel,
  room,
}: {
  hostel: string;
  room: number;
}): Roommate[] {
  const roommates: Roommate[] = [];
  // csv logic
  return [
    {
      name: "Jayanth Ramesh Kumar",
      rollNumber: "107124048",
      hostel: hostel,
      room: room,
      rollCall: false,
    },
    {
      name: "Harissh Sukumar",
      rollNumber: "107124041",
      hostel: hostel,
      room: room,
      rollCall: false,
    },
    {
      name: "Varun H Rao",
      rollNumber: "107124129",
      hostel: hostel,
      room: room,
      rollCall: false,
    },
  ];
}
