import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Home from "./routes/home";
import Profiles from "./routes/profiles";
import ScanResults from "./routes/scan_results";
//
const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/results/:profile_id" element={<ScanResults />} />
          <Route path="/list_profiles" element={<Profiles />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
