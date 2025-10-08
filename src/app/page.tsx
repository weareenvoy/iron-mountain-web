"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

export default function Home() {
  const router = useRouter();

  const apps = [
    {
      title: "Overlook Tablet",
      route: "/overlook-tablet",
    },
    {
      title: "Docent App",
      route: "/docent",
    },
    {
      title: "Kiosk 1",
      route: "/kiosk-1",
    },
  ];

  return (
    <div className="bg-background-primary flex flex-col items-center justify-center gap-10">
      {apps.map((app, index) => (
        <Button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            router.push(app.route);
          }}
          className="w-full"
        >
          {app.title}
        </Button>
      ))}
    </div>
  );
}
