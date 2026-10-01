import React from "react";
import { NeuronPulse } from "@/components/brand";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#07070A] py-16">
      <NeuronPulse size="md" label="Loading workspace..." />
    </div>
  );
}
