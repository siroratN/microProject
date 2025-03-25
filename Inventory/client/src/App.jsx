import Home from './pages/home/home';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import AddProduct from './pages/newPro/AddProduct';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route 
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/addProduct" element={<AddProduct />} />
      </Route>
    </Routes>
  );
}

export default App;
