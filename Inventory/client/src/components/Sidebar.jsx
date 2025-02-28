// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
            <h1 className="text-2xl font-bold mb-6">My App</h1>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
                            Contact
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
