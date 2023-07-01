function Settings() {
  return (
    <div className="text-white text-center mt-44 text-xl">
      <h1 className="font-bold text-6xl m-10">Settings</h1>
      <button
        className="rounded-lg border-red-500 border-solid border-2 p-2 m-1"
        //@ts-ignore
        onDoubleClick={() => window.electronAPI.clearStorage()}
      >
        CLEAR STORAGE
        <br />
        <p className="text-sm">(Double Click)</p>
      </button>
    </div>
  );
}

export default Settings;
