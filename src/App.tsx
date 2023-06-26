import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Mods from "./pages/Mods";
import Instances from "./pages/Instances";

function App() {
  return (
    <HashRouter>
      <Sidebar />
      <div className="ml-60 mt-6">
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/mods" element={<Mods />} />
          <Route path="/instances" element={<Instances />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
