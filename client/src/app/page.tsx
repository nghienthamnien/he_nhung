"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<string>("");

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("mqtt-message", (data) => {
      setData(data.topic + ": " + data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div className="text-center text-blue-500">{data}</div>;
}
