import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Nghia cho",
    },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
    },
  },
  animation: {
    duration: 800,
  },
  interaction: {
    intersect: false,
    mode: "nearest",
  },
  maintainAspectRatio: false,
};

function LineChart({
  width,
  height,
  customOptions,
  lineData,
}: {
  width: string;
  height: string;
  customOptions?: any;
  lineData: any;
}) {
  return (
    <div style={{ width, height }}>
      <Line
        options={{
          ...options,
          ...customOptions,
          interaction: { ...options.interaction, mode: "index" },
        }}
        data={lineData}
      />
    </div>
  );
}

export default LineChart;
