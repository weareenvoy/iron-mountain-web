import { NextResponse } from "next/server";
import { Tour } from "@/types";

// Mock data for docent schedule page. 
// 1. There might not be an "end time" field. 2. date and startTime could be 1 field?
const MOCK_TOURS: Tour[] = [
  {
    id: "tour-001",
    title: "fake title 1",
    guestName: "Herman Miller",
    guestLogo: null,
    date: "2025-09-20",
    startTime: "07:00 AM",
    endTime: "11:00 AM",
  },
  {
    id: "tour-002",
    title: "fake title 2",
    guestName: "PMU Umbrella Pharmaceuticals",
    guestLogo: null,
    date: "2025-09-20",
    startTime: "12:00 PM",
    endTime: "02:00 PM",
  },
  {
    id: "tour-003",
    title: "fake title 3",
    guestName: "Boyer-Boyer",
    guestLogo: null,
    date: "2025-09-27",
    startTime: "03:30 PM",
    endTime: "05:30 PM",
  },
  {
    id: "tour-004",
    title: "fake title 4",
    guestName: "Cremin-Okuneva",
    guestLogo: null,
    date: "2025-09-30",
    startTime: "01:00 PM",
    endTime: "02:00 PM",
  },
  {
    id: "tour-005",
    title: "fake title 5",
    guestName: "fake co 5",
    guestLogo: null,
    date: "2025-09-30",
    startTime: "03:00 PM",
    endTime: "04:00 PM",
  },
  {
    id: "tour-006",
    title: "fake title 6",
    guestName: "Zalauf Inc.",
    guestLogo: null,
    date: "2025-10-12",
    startTime: "01:00 PM",
    endTime: "02:00 PM",
  },
  {
    id: "tour-007",
    title: "fake title 7",
    guestName: "fake co 7",
    guestLogo: null,
    date: "2025-10-12",
    startTime: "03:00 PM",
    endTime: "04:00 PM",
  },
];

// Will replace with actual API call once BE is ready.
export async function GET() {
  try {
    return NextResponse.json(MOCK_TOURS);
  } catch (error) {
    console.error("error fetching tours", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}
