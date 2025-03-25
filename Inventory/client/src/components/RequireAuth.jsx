import { useEffect, useState } from "react";
import axios from "axios";

const RequireAuth = ({ children }) => {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("http://localhost:5001/check-auth", {
                    withCredentials: true
                });

                if (res.data.authenticated) {
                    setChecking(false);
                } else {
                    redirectToLogin();
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                redirectToLogin();
            }
        };

        const redirectToLogin = () => {
            window.location.href = "http://localhost:3003/login";
        };

        checkAuth();
    }, []);

    if (checking) {
        return <div>Loading...</div>;
    }

    return children;
};

export default RequireAuth;
