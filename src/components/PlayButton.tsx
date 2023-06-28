import { useState, useEffect } from "react";

function PlayButton() {
  const [version, setVersion] = useState("1.20");
  const [instances, setInstances] = useState<any>([]);
  const [visible, setVisible] = useState(false);

  const loopInstances = () => {
    //@ts-ignore
    const instancesRes = window.electronAPI.loopInstances().then((res) => {
      setInstances(res);
    });
  };

  useEffect(() => {
    loopInstances();
  }, []);

  setTimeout(() => {
    loopInstances();
  }, 7000);

  const launch = (name: string, version: string) => {
    console.log("Launching Minecraft");
    //@ts-ignore
    window.electronAPI.launchMc(name, version);
  };

  return (
    <div className="bottom-5 right-5 text-white text-5xl z-10 fixed flex items-center">
      <div className="text-xl m-5">
        <div className="border-b-2 border-solid border-gray-500 -translate-y-5 text-center duration-500">
          <button onClick={() => setVisible(!visible)}>{version}</button>
        </div>
        {visible && (
          <ul className="overflow-y-scroll top-10 duration-500 max-h-10">
            {instances.map((item: any) => (
              <li className="duration-100">
                <button
                  key={item}
                  onClick={() => {
                    setVersion(item);
                    setVisible(false);
                  }}
                  className="hover:text-green-400"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="bg-green-500 p-3 rounded-lg hover:scale-110 duration-300 flex items-center justify-center focus:outline-none"
        id="test"
        onClick={() => launch("", version)}
      >
        <svg
          width="101"
          height="112"
          viewBox="0 0 101 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-auto mr-3"
        >
          <path
            d="M92 40.4115C104 47.3397 104 64.6603 92 71.5885L27.5 108.828C15.5 115.756 0.499994 107.096 0.499995 93.2391L0.499998 18.7609C0.499999 4.90449 15.5 -3.75576 27.5 3.17244L92 40.4115Z"
            fill="white"
          />
        </svg>
        PLAY
      </button>
    </div>
  );
}

export default PlayButton;
