import { NextResponse } from "next/server";
import { BasecampData } from "@/types";

// Tour-specific basecamp content
const TOUR_BASECAMP_DATA: Record<string, BasecampData> = {
  "tour-001": {
    welcome: {
      text: "Welcome to Iron Mountain",
    },
    "problem-1": {
      text: "What's standing in your way?",
    },
    "problem-2": [
      {
        percent: "20",
        percentSubtitle: "of data remains dark",
      },
      { percent: "80-90", percentSubtitle: "of new data is unstructured" },
      {
        percent: "<1%",
        percentSubtitle: "of enterprise data is leveraged for AI",
      },
    ],
    "problem-3": {
      title: "What's holding you back?",
      "challenge-1": {
        title: "Too much complexity",
        body: "body 1",
        icon: "icon 1",
      },
      "challenge-2": {
        title: "Cost, Uncertain ROI",
        body: "body 2",
        icon: "icon 2",
      },
      "challenge-3": {
        title: "Too many risks",
        body: "body 3",
        icon: "icon 3",
      },
      "challenge-4": {
        title: "Too few skills",
        body: "body 4",
        icon: "icon 4",
      },
    },
    possibilities: {
      title: "Discover new possibilities",
    },
    "possibilities-a": {
      title: "Making data accessible",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
    "possibilities-b": {
      title: "Optimizing your assets",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
    "possibilities-c": {
      title: "Unlocking new value streams",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
  },
  "tour-002": {
    welcome: {
      text: "Welcome to Iron Mountain - Tour 2",
    },
    "problem-1": {
      text: "What's standing in your way? - Tour 2",
    },
    "problem-2": [
      {
        percent: "15",
        percentSubtitle: "of data remains dark",
      },
      { percent: "85-95", percentSubtitle: "of new data is unstructured" },
      {
        percent: "<2%",
        percentSubtitle: "of enterprise data is leveraged for AI",
      },
    ],
    "problem-3": {
      title: "What's holding you back? - Tour 2",
      "challenge-1": {
        title: "Legacy systems",
        body: "body 1",
        icon: "icon 1",
      },
      "challenge-2": {
        title: "Data silos",
        body: "body 2",
        icon: "icon 2",
      },
      "challenge-3": {
        title: "Compliance concerns",
        body: "body 3",
        icon: "icon 3",
      },
      "challenge-4": {
        title: "Resource constraints",
        body: "body 4",
        icon: "icon 4",
      },
    },
    possibilities: {
      title: "Discover new possibilities - Tour 2",
    },
    "possibilities-a": {
      title: "Modernizing infrastructure - Tour 2",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
    "possibilities-b": {
      title: "Breaking down silos - Tour 2",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
    "possibilities-c": {
      title: "Creating new opportunities - Tour 2",
      "body-1": "Body 1",
      "body-2": "Body 2",
      "body-3": "Body 3",
    },
  },
};

// TODO How would we know which tour basecamp is on? 
// GEC needs to know the tourID, basecamp asks for it first, then request the tour's basecamp data??
export async function GET() {
  try {
    // Temporary code. Just return tour-001's data for now.
    const basecampData = TOUR_BASECAMP_DATA["tour-001"];
    return NextResponse.json(basecampData);
  } catch (error) {
    console.error("error fetching basecamp data", error);
    return NextResponse.json(
      { error: "Failed to fetch basecamp data" },
      { status: 500 },
    );
  }
}
