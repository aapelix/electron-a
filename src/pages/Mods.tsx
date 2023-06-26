import { useEffect, useState } from "react";

function Mods() {
  let query = "";
  const [mods, setMods] = useState<
    {
      title: string;
      icon_url: string;
      description: string;
      slug: string;
      project_id: string;
    }[]
  >([]);
  useEffect(() => {
    fetch("https://api.modrinth.com/v2/search?limit=10")
      .then((response) => response.json())
      .then((data) => {
        setMods(data.hits);
      });
  }, []);

  function search() {
    fetch(`https://api.modrinth.com/v2/search?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setMods(data.hits);
      });
  }

  return (
    <div className="m-2">
      <input
        type="text"
        placeholder="Search..."
        className="m-2 p-5 text-xl rounded-lg bg-secondary text-white focus:outline-none mt-5"
        onChange={(e) => {
          query = e.target.value;
          search();
        }}
      />
      <div className="flex flex-wrap">
        {mods.map((mod) => (
          <div
            className="text-white p-5 bg-secondary m-2 rounded-lg hover:scale-110 duration-300 max-w-xs w-52 h-60 cursor-pointer"
            key={mod.project_id}
            onClick={() => {
              window.open(
                `https://modrinth.com/mod/${mod.slug}/version/latest`
              );
            }}
          >
            <div className="flex justify-center items-center">
              <img src={mod.icon_url} className="w-10 rounded-lg" alt="" />
              <p className="m-2 font-bold">{mod.title}</p>
            </div>
            <p className="mt-2 text-center">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mods;
