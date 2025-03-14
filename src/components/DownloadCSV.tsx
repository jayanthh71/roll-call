import { HostelData } from "@/app/page";
import { useCSVDownloader } from "react-papaparse";

export default function DownloadCSV({
  data,
  hostel,
  absentees,
}: {
  data: HostelData;
  hostel: string;
  absentees: boolean;
}) {
  const headers = ["NAME", "ROLL NUMBER", "HOSTEL", "ROOM", "ROLL CALL"];
  const result: Record<string, string | number>[] = [];

  Object.keys(data).forEach((hostel) => {
    Object.keys(data[hostel]).forEach((room) => {
      data[hostel][parseInt(room)].forEach((roommate) => {
        const row: Record<string, string | number> = {
          [headers[0]]: roommate.name,
          [headers[1]]: roommate.rollNumber,
          [headers[2]]: roommate.hostel,
          [headers[3]]: roommate.room,
          [headers[4]]: roommate.rollCall ? "Present" : "Absent",
        };
        result.push(row);
      });
    });
  });

  let downloadData: Record<string, string | number>[] = [];

  if (hostel === "All") {
    downloadData = absentees
      ? result.filter(
          (row: Record<string, string | number>) =>
            row["ROLL CALL"] === "Absent",
        )
      : result;
  } else {
    downloadData = absentees
      ? result.filter(
          (row: Record<string, string | number>) =>
            row["HOSTEL"] === hostel && row["ROLL CALL"] === "Absent",
        )
      : result.filter(
          (row: Record<string, string | number>) => row["HOSTEL"] === hostel,
        );
  }

  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <CSVDownloader
      className={`mt-4 w-xs cursor-pointer rounded ${absentees ? "bg-red-500" : "bg-white"} px-4 py-2 font-semibold ${absentees ? "" : "text-black"} ${absentees ? "hover:bg-red-600" : "hover:bg-gray-300"} sm:w-sm md:w-md lg:w-lg`}
      type={Type.Button}
      filename={`${hostel.toLowerCase().replace(" ", "_")}${absentees ? "_absentees" : ""}_${
        new Date().toISOString().split("T")[0]
      }`}
      bom={true}
      config={{
        delimiter: ",",
      }}
      data={downloadData}
    >
      Download {hostel} {absentees ? "Absentees" : ""} Data
    </CSVDownloader>
  );
}
