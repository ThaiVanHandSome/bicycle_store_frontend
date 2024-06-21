import { refreshToken } from "~/services/apiServices/AuthService";
import {Modal, ModalContent, ModalHeader, ModalBody, useDisclosure} from "@nextui-org/react";
import { Link } from "react-router-dom";
import routes from "~/config/routes";

const { createContext, useState, useContext, useEffect, useRef } = require("react");

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ( {children} ) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
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
        const intervalId = setInterval(async () => {
            try {
                await getAccessToken();
            } catch (error) {
                console.log(error);
            }
        }, 1000 * 60);
        setIdInterval(intervalId);
        localStorage.setItem("idInterval", JSON.stringify(intervalId));
    }

    const stopRefreshToken = () => {
        clearInterval(idInterval);
        setIdInterval(null);
    }

    useEffect(() => {
        const storedIdInterval = JSON.parse(localStorage.getItem('idInterval'));
        if(storedIdInterval) {
            startRefreshToken();
            setIdInterval(storedIdInterval);
        }

        return () => {
            setIdInterval(null);
            clearInterval(idInterval);
        };
    }, []);

    return (
        <AuthContext.Provider value={[startRefreshToken, stopRefreshToken ]}>
            <Modal backdrop="opaque" isOpen={isOpen}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Thông báo</ModalHeader>
                        <ModalBody>
                            <div className="flex justify-center">
                                <p className="font-bold text-lg text-danger"> 
                                    Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!
                                </p>
                                <div>
                                    <Link className="font-bold rounded-lg text-white bg-pri" to={routes.login}>Đăng nhập</Link>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
                </ModalContent>
            </Modal>
            {children}
        </AuthContext.Provider>
    );
}
