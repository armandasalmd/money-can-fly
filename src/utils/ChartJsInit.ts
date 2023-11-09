import { Chart as ChartJS, CategoryScale, PointElement, LineElement, BarController, LinearScale, BarElement, Title, Tooltip, Legend, Filler, LineController, TimeScale } from "chart.js";

ChartJS.register(
  PointElement,
  BarController,
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Filler,
  LineController,
  LineElement,
  Legend,
  TimeScale);