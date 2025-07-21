// src/app/AppWrapper.js
"use client";

import { Providers } from "./providers"; // NextAuth
import { MapProvider } from "@/context/MapContext";

export function AppWrapper({ children }) {
  return (
    <MapProvider>
      <Providers>{children}</Providers>
    </MapProvider>
  );
}
