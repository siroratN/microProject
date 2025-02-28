// src/components/Sidebar.jsx
// import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 min-h-screen bg-gray-800 text-white p-4 relative z-50">
            <h1 className="text-2xl font-bold mb-6">My App</h1>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <a href="http://localhost:3001/home" className="block p-2 hover:bg-gray-700 rounded">Home</a>
                    </li>
                    <li>
                        <a href="http://localhost:3006/" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
                    </li>
                    <li>
                        <a href="http://localhost:3005/"  className="block p-2 hover:bg-gray-700 rounded">Report</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
