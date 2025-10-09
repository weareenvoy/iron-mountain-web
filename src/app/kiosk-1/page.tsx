"use client";

// import { useMqtt } from "@/components/MqttProvider";

export default function KioskOneApp() {
  // Access the current state from MqttProvider, if needed. TBD whether we need to access it here or not.
  // if current_kiosk_one_state says the state is "xxxxxx", we display fields 1,2,3..
  // const { currentState } = useMqtt();
  // const { current_kiosk_one_state } = currentState;

  return (
    <div className="bg-brand-down flex h-[5120px] w-[2160px] flex-col items-center overflow-hidden">
      <p className="font-headline-md text-white">Kiosk 1 app</p>
      <p>size 2160x5120</p>
    </div>
  );
}
