import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./page/Home";
import { LoginPage } from "./page/Welcome";
import Dashboard from "./page/Article";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
