"use client";
// import { UserAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import { usePathname } from "next/navigation";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { MqttContextProvider } from "@/contexts/MqttContext";
import { DashboardContextProvider } from "@/contexts/DashboardContext";
import { ControlContextProvider } from "@/contexts/ControlContext";

const AppBarItems = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    route: "/dashboard",
  },
];

function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    AppBarItems.findIndex((item) => item.route === pathname)
  );
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <MqttContextProvider>
      <DashboardContextProvider>
        <ControlContextProvider>
          <div className=" flex flex-col h-screen w-screen">
            <Drawer
              open={drawerOpen}
              onClose={handleDrawerToggle}
              PaperProps={{
                style: {
                  width: "20%",
                  minWidth: "300px",
                  maxWidth: "800px",
                  padding: "2.5rem 0 0 0",
                },
              }}
            >
              <List
                className="mt-10 flex flex-col 
justify-between h-full
"
                style={{
                  padding: "0px",
                }}
              >
                <div>
                  {AppBarItems.map((item, index) => (
                    <ListItem
                      key={index}
                      className="cursor-pointer select-none transition-all"
                      onClick={() => {
                        setSelectedIndex(index);
                        handleDrawerToggle();
                        router.push(item.route);
                      }}
                      style={{
                        backgroundColor:
                          selectedIndex == index ? "#22c55e" : "transparent",
                        color: selectedIndex == index ? "white" : "black",
                        padding: "1rem",
                      }}
                    >
                      <ListItemIcon
                        style={{
                          color: selectedIndex == index ? "white" : "black",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "0px",
                    backgroundColor: "#22c55e",
                    padding: "0.5rem",
                  }}
                >
                  Sign Out
                </Button>
              </List>
            </Drawer>
            <div
              style={{
                marginTop: "3.5rem",
                padding: "1rem",
              }}
            >
              {children}
            </div>
          </div>
        </ControlContextProvider>
      </DashboardContextProvider>
    </MqttContextProvider>
  );
}

export default MainLayout;
