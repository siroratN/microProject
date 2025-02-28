import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
