const minimize = document.getElementById("titlebar-minimize");
const closeBtn = document.getElementById("titlebar-close");

minimize.addEventListener("click", () => {
    window.electronAPI.minimize();
});

closeBtn.addEventListener("click", () => {
    window.electronAPI.close();
});

