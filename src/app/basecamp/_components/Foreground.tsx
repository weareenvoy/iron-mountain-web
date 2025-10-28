"use client";

import { BasecampData } from "@/types";
import { useBasecamp } from "./BasecampProvider";

// Mapping from moment + beatIdx to data key
const getDataKey = (moment: string, beatIdx: number): string => {
  if (moment === "welcome" && beatIdx === 0) return "welcome";
  if (moment === "problem" && beatIdx === 0) return "problem-1";
  if (moment === "problem" && beatIdx === 2) return "problem-2";
  if (moment === "problem" && beatIdx === 3) return "problem-3";
  if (moment === "possibilities" && beatIdx === 0) return "possibilities";
  if (moment === "possibilities" && beatIdx === 2) return "possibilities-a";
  if (moment === "possibilities" && beatIdx === 3) return "possibilities-b";
  if (moment === "possibilities" && beatIdx === 4) return "possibilities-c";

  return ""; // No content for this moment/beatIdx combination
};

export default function Foreground() {
  const { data, currentMoment, currentBeatIdx } = useBasecamp();

  const dataKey = getDataKey(currentMoment, currentBeatIdx);
  const content = data && dataKey && data[dataKey as keyof BasecampData];

  if (!content) {
    return null; // No content to show for this moment/beatIdx
  }

  // Render different content based on the data key. Need to add animation, and hardcode wait x seconds to start showing the content?
  const renderContent = () => {
    switch (dataKey) {
      case "welcome":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple text-center text-6xl font-bold">
              {(content as BasecampData["welcome"]).text}
            </div>
          </div>
        );

      case "problem-1":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple text-center text-5xl font-bold">
              {(content as BasecampData["problem-1"]).text}
            </div>
          </div>
        );

      case "problem-2":
        const problem2Data = content as BasecampData["problem-2"];
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple space-y-8 text-center">
              {problem2Data.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-8xl font-bold">{item.percent}</div>
                  <div className="text-2xl">{item.percentSubtitle}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "problem-3":
        const problem3Data = content as BasecampData["problem-3"];
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple space-y-8 text-center">
              <div className="text-5xl font-bold">{problem3Data.title}</div>
              <div className="grid grid-cols-2 gap-8">
                {/* Challenge 1 */}
                <div className="text-2xl font-semibold">
                  {problem3Data["challenge-1"].title}
                </div>
                <div className="text-lg">
                  {problem3Data["challenge-1"].body}
                </div>
                {/* Challenge 2 */}
                <div className="text-2xl font-semibold">
                  {problem3Data["challenge-2"].title}
                </div>
                <div className="text-lg">
                  {problem3Data["challenge-2"].body}
                </div>
                {/* Challenge 3 */}
                <div className="text-2xl font-semibold">
                  {problem3Data["challenge-3"].title}
                </div>
                <div className="text-lg">
                  {problem3Data["challenge-3"].body}
                </div>
                {/* Challenge 4 */}
                <div className="text-2xl font-semibold">
                  {problem3Data["challenge-4"].title}
                </div>
                <div className="text-lg">
                  {problem3Data["challenge-4"].body}
                </div>
              </div>
            </div>
          </div>
        );

      case "possibilities":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple text-center text-5xl font-bold">
              {(content as BasecampData["possibilities"]).title}
            </div>
          </div>
        );

      case "possibilities-a":
      case "possibilities-b":
      case "possibilities-c":
        const possibilitiesData = content as BasecampData["possibilities-a"];
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-secondary-im-purple space-y-8 text-center">
              <div className="text-5xl font-bold">
                {possibilitiesData.title}
              </div>
              <div className="space-y-4">
                <div className="text-2xl">{possibilitiesData["body-1"]}</div>
                <div className="text-2xl">{possibilitiesData["body-2"]}</div>
                <div className="text-2xl">{possibilitiesData["body-3"]}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
}
