function Sidebar() {
  return (
    <nav className="bg-primary h-full w-60 fixed top-0 left-0 overflow-x-hidden flex justify-center items-center">
      <div className="pt-10">
        <div className="-translate-y-1/2 border-l-2 border-solid hover:border-green-400 duration-200">
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-200"
            href="#/"
          >
            Home
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-200"
            href="#/instances"
          >
            Instances
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-200"
            href="#/mods"
          >
            Mods
          </a>
          <a
            className="p-3 text-xl block text-white cursor-pointer hover:text-green-400 duration-200"
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
