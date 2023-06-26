const minimize = document.getElementById("titlebar-minimize");
const close = document.getElementById("titlebar-close");
const amogus = document.getElementById("amogus");

minimize.addEventListener("click", () => {
    window.electronAPI.minimize();
});

close.addEventListener("click", () => {
    window.electronAPI.close();
});

amogus.addEventListener("click", () => {
    window.electronAPI.launchMc();
});

