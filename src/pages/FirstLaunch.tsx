import { useEffect, useState } from "react";

function FirstLaunch() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum(0);
  }, []);

  const updateNum = () => {
    setNum(num - 150);
  };

  return (
    <div className="text-white text-center overflow-hidden z-10">
      <div
        className="duration-300 mt-44"
        style={{
          transform: `translateX(${num}%)`,
        }}
      >
        <h1 className="text-8xl">Welcome, </h1>
        <p className="text-xl">lets quickly setup your launcher</p>
        <button
          className="border-green-400 border-solid border-2 p-2 rounded-lg text-3xl hover:bg-green-400 duration-300 hover:text-black m-5"
          onClick={() => {
            updateNum();
          }}
        >
          Next &#10140;
        </button>
      </div>

      <div
        className="duration-300"
        style={{
          transform: `translateX(${num + 150}%)`,
        }}
      >
        <div className="absolute -top-56 left-1/2 -translate-x-1/2">
          <h1 className="text-6xl">Get Scammed</h1>
          <p className="text-xl">There is nothing to setup xD</p>
          <button
            className="border-green-400 border-solid border-2 p-2 rounded-lg text-3xl hover:bg-green-400 duration-300 hover:text-black m-5"
            onClick={() => {
              window.location.assign("#/");
            }}
          >
            To Launcher &#10140;
          </button>
        </div>
      </div>
    </div>
  );
}

export default FirstLaunch;
