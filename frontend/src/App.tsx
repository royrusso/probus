import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Home from "./routes/home";
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
