import { Routes } from "react-router-dom";
import Header from "./layouts/header";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes></Routes>
      </main>
    </>
  );
};

export default App;
