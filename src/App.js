import { useState } from "react";
import "./App.css";
import Calendar from "./components/Calendar";

function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className={`App ${dark ? "dark" : ""}`}>
      <Calendar dark={dark} setDark={setDark} />
    </div>
  );
}

export default App;
