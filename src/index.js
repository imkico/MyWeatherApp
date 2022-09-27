import { createRoot } from "react-dom/client";
import WeatherApp from "./WeatherApp";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const App = () => <WeatherApp />;

root.render(
  <>
    <App />
  </>
);
