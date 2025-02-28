import { Route, Routes } from "react-router-dom";
import Layout from './src/components/ui/Layout';
import Dashboard from "./src/pages/dashboard";

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
