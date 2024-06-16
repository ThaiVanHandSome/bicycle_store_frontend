import { refreshToken } from "~/services/apiServices/AuthService";

const { createContext, useState, useContext } = require("react");

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ( {children} ) => {
    const [idInterval, setIdInterval] = useState(null);

    const getAccessToken = async () => {
        const token = localStorage.getItem("refreshToken");
        const res = await refreshToken(token);
        if (res.status === "success") {
            const newAccessToken = res.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
        }
    };

    const startRefreshToken = () => {
        const idInterval = setInterval(async () => {
            await getAccessToken();
        }, 14 * 60 * 1000);
        setIdInterval(idInterval);
    }

    const stopRefreshToken = () => {
        clearInterval(idInterval);
        setIdInterval(null);
    }

    return (
        <AuthContext.Provider value={[startRefreshToken, stopRefreshToken ]}>
            {children}
        </AuthContext.Provider>
    );
}
