import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Hey this is workin");

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="flex align-center justify-center w-full h-full">
      <h1 className="text-3xl font-bold underline">{message}</h1>
    </div>
  );
}

export default App;
