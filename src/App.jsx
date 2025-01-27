import { useState } from "react";
import "./index.css";
import Form from "./UserForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Form />
    </>
  );
}

export default App;
