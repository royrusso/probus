import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Header from "./layouts/header";
//
const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
