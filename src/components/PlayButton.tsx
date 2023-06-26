function PlayButton() {
  const launch = () => {
    console.log("Launching Minecraft");
    //@ts-ignore
    window.electronAPI.launchMc();
  };

  return (
    <div className="bottom-5 right-5 text-white text-5xl z-10 fixed">
      <button
        className="bg-green-500 p-3 rounded-lg hover:scale-110 duration-300 flex items-center justify-center focus:outline-none"
        id="test"
        onClick={launch}
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
