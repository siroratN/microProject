import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
const permission = axios.get()

const Layout = () => {
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-1 w-full p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
