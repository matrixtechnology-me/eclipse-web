"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const DoNotDisturb = () => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode">Não perturbe</Label>
      <Switch id="airplane-mode" />
    </div>
  );
};
