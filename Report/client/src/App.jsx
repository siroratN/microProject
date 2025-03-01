import { Route, Routes } from "react-router-dom";
import Layout from './components/ui/Layout';
import Report from "./pages/report";

function App() {
  return (
    <Routes>
      <Route  element={<Layout />}>
        <Route path="/report" element={<Report />} />
      </Route>
    </Routes>
  );
}

export default App;
