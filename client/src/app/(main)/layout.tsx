"use client";
import React from "react";
import { MqttContextProvider } from "@/contexts/MqttContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MqttContextProvider>
      <DashboardContextProvider>
        <div className=" flex flex-col h-screen w-screen">
          <div
            style={{
              marginTop: "3.5rem",
              padding: "1rem",
            }}
          >
            {children}
          </div>
        </div>
      </DashboardContextProvider>
    </MqttContextProvider>
  );
}

export default MainLayout;
