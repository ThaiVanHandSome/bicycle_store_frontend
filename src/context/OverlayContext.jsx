import { Spinner } from "@nextui-org/react";

const { createContext, useContext, useRef } = require("react");

const OverlayContext = createContext();

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }) => {
    const spinnerRef = useRef();
    const overlayRef = useRef();

    const openOverlay = () => {
        spinnerRef.current.style.display = "block";
        overlayRef.current.style.display = "block";
    }

    const hideOverlay = () => {
        spinnerRef.current.style.display = "none";
        overlayRef.current.style.display = "none";
    }
    return (
        <OverlayContext.Provider value={[openOverlay, hideOverlay]}>
            <div className="relative" >
                <div ref={overlayRef} style={{backgroundColor: "rgba(0, 0, 0, 0.15)"}} className="hidden absolute top-[-100px] left-0 right-0 bottom-0 z-40"></div>
                <Spinner ref={spinnerRef} color="warning" className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
                {children}
            </div>
        </OverlayContext.Provider>
    )
}