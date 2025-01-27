import { useState } from "react";
import "./index.css";
import Form from "./UserForm";
import Logo from "./images/sltlogo.png";
import BG from "./images/bg.jpg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Logo Container */}
      <div className="mb-6 p-4 bg-white rounded-b-4xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl">
        <img
          src={Logo}
          alt="SLT Logo"
          className="h-18 sm:h-20 w-auto mx-auto"
        />
      </div>

      <div className="mb-6   shadow-lg w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-8xl">
        <Form />
      </div>
    </div>
  );
}

export default App;
