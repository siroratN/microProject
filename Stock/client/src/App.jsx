import './App.css';
import { Route, Routes } from "react-router-dom";
import ProductDetail from './pages/ProductDetail';
import Layout from './components/Layout';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/detail/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
