import { useEffect, useState } from "react";
import Select from "react-select";

const versions = [
  { value: "1.20.1", label: "1.20.1" },
  { value: "1.20", label: "1.20" },
  { value: "1.19.4", label: "1.19.4" },
  { value: "1.19.3", label: "1.19.3" },
  { value: "1.19.2", label: "1.19.2" },
  { value: "1.19.1", label: "1.19.1" },
  { value: "1.19", label: "1.19" },
  { value: "1.18.2", label: "2.18.1" },
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
  { value: "1.15.1", label: "1.15.1" },
  { value: "1.15", label: "1.15" },
  { value: "1.14.4", label: "1.14.4" },
  { value: "1.14.3", label: "1.14.3" },
  { value: "1.14.2", label: "1.14.2" },
  { value: "1.14.1", label: "1.14.1" },
  { value: "1.14", label: "1.14" },
  { value: "1.13.2", label: "1.13.2" },
  { value: "1.13.1", label: "1.13.1" },
  { value: "1.13", label: "1.13" },
  { value: "1.12.2", label: "1.12.2" },
  { value: "1.12.1", label: "1.12.1" },
  { value: "1.12", label: "1.12" },
  { value: "1.11.2", label: "1.11.2" },
  { value: "1.11.1", label: "1.11.1" },
  { value: "1.11", label: "1.11" },
  { value: "1.10.2", label: "1.10.2" },
  { value: "1.10.1", label: "1.10.1" },
  { value: "1.10", label: "1.10" },
  { value: "1.9.4", label: "1.9.4" },
  { value: "1.9.3", label: "1.9.3" },
  { value: "1.9.2", label: "1.9.2" },
  { value: "1.9.1", label: "1.9.1" },
  { value: "1.9", label: "1.9" },
  { value: "1.8.9", label: "1.8.9" },
  { value: "1.8.8", label: "1.8.8" },
  { value: "1.8.7", label: "1.8.7" },
  { value: "1.8.6", label: "1.8.6" },
  { value: "1.8.5", label: "1.8.5" },
  { value: "1.8.4", label: "1.8.4" },
  { value: "1.8.3", label: "1.8.3" },
  { value: "1.8.2", label: "1.8.2" },
  { value: "1.8.1", label: "1.8.1" },
  { value: "1.8", label: "1.8" },
  { value: "1.7.10", label: "1.7.10" },
  { value: "1.7.9", label: "1.7.9" },
  { value: "1.7.8", label: "1.7.8" },
  { value: "1.7.7", label: "1.7.7" },
  { value: "1.7.6", label: "1.7.6" },
  { value: "1.7.5", label: "1.7.5" },
  { value: "1.7.4", label: "1.7.4" },
  { value: "1.7.3", label: "1.7.3" },
  { value: "1.7.2", label: "1.7.2" },
  { value: "1.6.4", label: "1.6.4" },
  { value: "1.6.2", label: "1.6.2" },
  { value: "1.6.1", label: "1.6.1" },
];

function Instances() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [instances, setInstances] = useState<any>([]);
  const [client, setClient] = useState("vanilla");
  const [launched, setLaunched] = useState(false);

  const createInstance = () => {
    setVisible(!visible);
  };

  const createInstanceFunc = () => {
    const finalversion = selectedOption?.value;
    if (finalversion == undefined) return;
    if (name == "") return;
    else {
      //@ts-ignore
      window.electronAPI.createInstance("", client, name, finalversion);
      setTimeout(() => {
        loopInstances();
      }, 100);
      setVisible(!visible);
      setSelectedOption(null);
      setName("");
    }
  };

  const loopInstances = () => {
    //@ts-ignore
    const instancesRes = window.electronAPI.loopInstances().then((res) => {
      if (res) setInstances(res);
    });
  };

  useEffect(() => {
    loopInstances();
  }, []);

  setTimeout(() => {
    loopInstances();
  }, 7000);

  const launchMc = (version: string) => {
    setLaunched(true);
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
              onChange={(e) => {
                setName(e.target.value);
              }}
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
            <div>
              <button
                className="m-1 p-2 border-solid hover:border-green-400 mb-5 focus:scale-125 border-2 duration-300 rounded-lg "
                onClick={() => setClient("vanilla")}
              >
                Vanilla
              </button>
              <button
                className="m-1 p-2 border-solid hover:border-green-400 mb-5 focus:scale-125 border-2 duration-300 rounded-lg "
                onClick={() => setClient("forge")}
              >
                Forge
              </button>
              <button
                className="m-1 p-2 border-solid hover:border-green-400 mb-5 focus:scale-125 border-2 duration-300 rounded-lg "
                onClick={() => setClient("fabric")}
              >
                Fabric
              </button>
              <button
                className="m-1 p-2 border-solid hover:border-green-400 mb-5 focus:scale-125 border-2 duration-300 rounded-lg "
                onClick={() => setClient("quilt")}
              >
                Quilt
              </button>
            </div>
            <button
              className="text-black bg-white p-2 rounded-lg"
              onClick={() => {
                createInstanceFunc();
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
      <ul className="absolute top-36 ml-1">
        {!launched && (
          <div>
            {instances
              .filter((name: string | string[]) => name.includes(search))
              .map((item: any) => (
                <li
                  className="p-4 m-2 w-[calc(100vw-300px)] cursor-pointer bg-secondary rounded-lg"
                  key={item}
                >
                  <div className="text-white" key={item}>
                    <p className="font-bold">{item.toUpperCase()}</p>
                    <div className="absolute right-5 -translate-y-2">
                      <button
                        className="border-2 p-2 rounded-lg m-2 border-red-500 -translate-y-8 hover:scale-110 duration-300"
                        onClick={() => deleteInstance(item)}
                      >
                        DELETE
                      </button>
                      <button
                        className="border-2 p-2 rounded-lg m-2 border-green-500 -translate-y-8 hover:scale-110 duration-300"
                        onClick={() => launchMc(item)}
                      >
                        PLAY
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </div>
        )}
        {launched && (
          <div className="flex justify-center items-center flex-wrap">
            <p className="text-white text-8xl text-center">Launching...</p>
            <p className="text-white text-2xl text-center">
              (First launch can take a moment)
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Instances;
