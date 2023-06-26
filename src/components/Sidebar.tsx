import { useState } from "react";

function Sidebar() {
  const name = "aapelix";
  const [visible, setVisible] = useState(false);

  return (
    <nav className="bg-primary h-full w-60 fixed top-0 left-0 overflow-x-hidden text-center">
      <div className="pt-10">
        <div className="flex justify-center items-center">
          <div className="p-2 w-[calc(100%-50px)] m-1 pb-6 border-b-2 border-solid border-secondary">
            <button
              className="flex items-center justify-center hover:scale-110 duration-300"
              onClick={() => {
                setVisible(!visible);
              }}
            >
              <img
                src={`https://mc-heads.net/avatar/${name}`}
                className="h-14 rounded-md"
                alt="Your avatar"
              />
              <p className="text-white text-xl ml-5 font-bold">
                {name.toUpperCase()}
              </p>
            </button>
          </div>
        </div>
        {visible && (
          <div className="absolute w-56 rounded-lg ml-2 text-center flex justify-center items-center flex-col bg-black -translate-y-4">
            <button className="text-xl block text-white text-center m-5 hover:text-green-400 duration-100">
              Add Account
            </button>
            <button className="text-xl block text-white text-center m-5 hover:text-green-400 duration-100">
              Change skin
            </button>
            <button className="text-xl block text-white text-center m-5 hover:text-green-400 duration-100">
              Change Account
            </button>
          </div>
        )}

        <div className="pt-6">
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-100"
            href="#/"
          >
            Home
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-100"
            href="#/instances"
          >
            Instances
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-100"
            href="#/mods"
          >
            Mods
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-100"
            href="#/settings"
          >
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
