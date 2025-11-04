import { NextResponse } from "next/server";
import { BasecampData } from "@/types";

// Mock data for a tour's basecamp content.
const MOCK_BASECAMP_DATA: BasecampData = {
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
    title: "Unlocking new value streams",
    "body-1": "Body 1",
    "body-2": "Body 2",
    "body-3": "Body 3",
  },
  "possibilities-c": {
    title: "Optimizing your assets",
    "body-1": "Body 1",
    "body-2": "Body 2",
    "body-3": "Body 3",
  },
};

// The /basecamp endpoint knows what tour we are on. No need to pass in tourId.
export async function GET() {
  try {
    return NextResponse.json(MOCK_BASECAMP_DATA);
  } catch (error) {
    console.error("error fetching basecamp data", error);
    return NextResponse.json(
      { error: "Failed to fetch basecamp data" },
      { status: 500 },
    );
  }
}
