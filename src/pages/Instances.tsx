import { useEffect, useState } from "react";
import Select from "react-select";

const versions = [
  { value: "1.18.2", label: "1.18.2" },
  { value: "1.18.1", label: "1.18.1" },
  { value: "1.18", label: "1.18" },
  { value: "1.17.1", label: "1.17.1" },
  { value: "1.17", label: "1.17" },
  { value: "1.16.5", label: "1.16.5" },
  { value: "1.16.4", label: "1.16.4" },
  { value: "1.16.3", label: "1.16.3" },
  { value: "1.16.2", label: "1.16.2" },
  { value: "1.16.1", label: "1.16.1" },
  { value: "1.16", label: "1.16" },
  { value: "1.15.2", label: "1.15.2" },
  { value: "1.14.4", label: "1.14.4" },
  { value: "1.13.2", label: "1.13.2" },
  { value: "1.12.2", label: "1.12.2" },
  { value: "1.11.2", label: "1.11.2" },
  { value: "1.10.2", label: "1.10.2" },
  { value: "1.9.4", label: "1.9.4" },
  { value: "1.8.9", label: "1.8.9" },
];

function Instances() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [instances, setInstances] = useState<any>([]);

  const createInstance = () => {
    setVisible(!visible);
  };

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

  const launchMc = (version: string) => {
    console.log("Launching Minecraft");
    //@ts-ignore
    window.electronAPI.launchMc("", version);
  };

  const deleteInstance = (name: string) => {
    //@ts-ignore
    window.electronAPI.deleteInstance("", name);
    setTimeout(() => {
      loopInstances();
    }, 100);
  };

  return (
    <div className="m-2 flex">
      <div className="flex w-screen">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Instances..."
          className="m-2 p-5 text-xl rounded-lg bg-secondary text-white focus:outline-none mt-5"
        />
        <button
          className="text-white text-6xl rounded-full bg-secondary mt-5 h-16 w-16 hover:scale-110 duration-300"
          onClick={createInstance}
        >
          <p>&#43;</p>
        </button>
      </div>
      {visible && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary h-96 w-96 flex justify-center text-center text-white rounded-lg z-10 shadow-2xl">
          <div className="mt-10">
            <input
              type="text"
              placeholder="Name for instance"
              className="focus:outline-none rounded-lg bg-secondary p-2 m-2"
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <Select
                defaultValue={selectedOption}
                //@ts-ignore
                onChange={setSelectedOption}
                isSearchable={true}
                options={versions}
                className="mb-5 text-black"
              />
            </div>
            <button
              className="text-black bg-white p-2 rounded-lg"
              onClick={() => {
                const finalversion = selectedOption?.value;
                if (finalversion == undefined) return;
                if (name == "") return;
                else {
                  setVisible(!visible);
                  console.log(name);

                  //@ts-ignore
                  window.electronAPI.createInstance(name, finalversion);
                  setTimeout(() => {
                    loopInstances();
                  }, 100);
                  setSelectedOption(null);
                  setName("");
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
      <ul className="absolute top-36 ml-1">
        {instances.map((item: any) => (
          <li className="p-4 m-2 w-[calc(100vw-300px)] cursor-pointer bg-secondary rounded-lg">
            <div className="text-white" key={item}>
              <p className="font-bold">{item}</p>
              <button
                className="absolute right-10 border-2 p-2 rounded-lg border-green-500 -translate-y-8 hover:scale-110 duration-300"
                onClick={() => launchMc(item)}
              >
                PLAY
              </button>
              <button
                className="absolute right-24 mr-2 border-2 p-2 rounded-lg border-red-500 -translate-y-8 hover:scale-110 duration-300"
                onClick={() => deleteInstance(item)}
              >
                DELETE
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Instances;
