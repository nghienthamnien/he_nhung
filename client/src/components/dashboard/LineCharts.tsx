import { useContext } from "react";
import LineChart from "@/components/charts/LineChart";
import { DashboardContext } from "@/contexts/DashboardContext";
import { Skeleton } from "@mui/material";

export const LineCharts = () => {
  const { tempLineData, humidLineData, lightLineData, moiLineData } =
    useContext(DashboardContext);

  console.log("tempLineData", tempLineData);
  return (
    <div className="flex flex-row space-x-4 flex-wrap justify-around">
      {tempLineData ? (
        <LineChart
          key={"temp"}
          width="800px"
          height="400px"
          lineData={tempLineData}
          customOptions={{
            plugins: {
              title: {
                display: true,
                text: "Temperature",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Temperature (°C)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                min: 0,
                max: 200,
              },
              x: {
                title: {
                  display: true,
                  text: "Time(HH:MM:SS)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="800px"
          height="400px"
          animation="wave"
        />
      )}
      {humidLineData ? (
        <LineChart
          key={"humid"}
          width="800px"
          height="400px"
          lineData={humidLineData}
          customOptions={{
            plugins: {
              title: {
                display: true,
                text: "Humidity",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Humidity (%)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                min: 0,
                max: 200,
              },
              x: {
                title: {
                  display: true,
                  text: "Time(HH:MM:SS)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="800px"
          height="400px"
          animation="wave"
        />
      )}
      {lightLineData ? (
        <LineChart
          key={"light"}
          width="800px"
          height="400px"
          lineData={lightLineData}
          customOptions={{
            plugins: {
              title: {
                display: true,
                text: "Light",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Light (%)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                min: 0,
                max: 200,
              },
              x: {
                title: {
                  display: true,
                  text: "Time(HH:MM:SS)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="800px"
          height="400px"
          animation="wave"
        />
      )}
      {moiLineData ? (
        <LineChart
          key={"moisture"}
          width="800px"
          height="400px"
          lineData={moiLineData}
          customOptions={{
            plugins: {
              title: {
                display: true,
                text: "Soil Moisture",
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Soil Moisture (%)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                min: 0,
                max: 200,
              },
              x: {
                title: {
                  display: true,
                  text: "Time(HH:MM:SS)",
                  color: "green",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="800px"
          height="400px"
          animation="wave"
        />
      )}
    </div>
  );
};
