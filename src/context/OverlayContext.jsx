import { Spinner } from "@nextui-org/react";

const { createContext, useContext, useRef } = require("react");

const OverlayContext = createContext();

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }) => {
    const spinnerRef = useRef();
    const overlayRef = useRef();
    const parentRef = useRef();

    const openOverlay = () => {
        const rect = parentRef.current.getBoundingClientRect();
        spinnerRef.current.style.display = "block";
        console.log(`-${Math.floor(rect.top)}px`);
        overlayRef.current.style.top = `${-1 * Math.floor(rect.top + 1)}px`;
        overlayRef.current.style.display = "block";
        document.body.style.overflow = 'hidden';
    }

    const hideOverlay = () => {
        spinnerRef.current.style.display = "none";
        overlayRef.current.style.display = "none";
        document.body.style.overflow = 'auto';
    }
    return (
        <OverlayContext.Provider value={[openOverlay, hideOverlay]}>
            <div className="relative" ref={parentRef}>
                <div ref={overlayRef} style={{backgroundColor: "rgba(0, 0, 0, 0.15)"}} className="hidden absolute left-0 w-full h-[100vh] z-40">
                    <Spinner ref={spinnerRef} color="warning" className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
                </div>
                {children}
            </div>
        </OverlayContext.Provider>
    )
}