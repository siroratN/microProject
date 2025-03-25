// src/components/Sidebar.jsx
// import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
const getPermission = async () => {
    try {
        const res = await axios.get("http://localhost:5001/authen/checkPermission", {
            withCredentials: true,
        });
        console.log("Permission data:", res.data.role);
        if(res.data.role === "none"){
            console.log('unauthorized')
            window.location.href = "http://localhost:3003/login"
        }

        return res.data.role;
    } catch (error) {
        console.error("Error fetching permissions:", error.response?.data || error.message);
    }
};


const Sidebar = () => {
    const [role, setRole] = useState("")

    useEffect(() => {
        const fetchRole = async () => {
            const fetchedRole = await getPermission();
            setRole(fetchedRole);
        };
        fetchRole();
    }, []);

    const Logout = async () => {
        try {
            const res = await axios.get("http://localhost:5001/authen/logout", {
                withCredentials: true,
            })
            window.location.href = "http://localhost:3003/login"
        } catch (error) {
            console.log(error)
        }
    }

    const checkRole = role === 'admin' || false;

    return (
        <div className="w-64 min-h-screen bg-gray-800 text-white p-4 relative z-50">
            <h1 className="text-2xl font-bold mb-6">My App</h1>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <a href="http://localhost:3001/home" className="block p-2 hover:bg-gray-700 rounded">Home</a>
                    </li>
                    <li>
                        <a href="http://localhost:3006/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
                    </li>
                    {checkRole &&
                        <>
                            <li>
                                <a href="http://localhost:3005/report" className="block p-2 hover:bg-gray-700 rounded">Report</a>
                            </li>
                        </>
                    }

                            <li>
                                <a onClick={Logout} className="block p-2 hover:bg-gray-700 rounded">Logout</a>
                            </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
