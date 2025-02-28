import { Route, Routes } from "react-router-dom";
import Layout from '../../../Inventory/client/src/components/Layout';
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route  element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
