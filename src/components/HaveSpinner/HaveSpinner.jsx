import { Spinner } from "@nextui-org/react";
import { useEffect, useRef } from "react";

function HaveSpinner({ hideSpinner, children }) {
    const parRef = useRef();

    useEffect(() => {
        if (hideSpinner) {
            parRef.current.style.minHeight = "100px";
        }
    },[hideSpinner]);
    return (
        <section ref={parRef} className="relative min-h-[100vh] w-full">
            {
                hideSpinner ? (
                    <>
                        {children}
                    </>
                ) : (
                    <Spinner
                        color="warning"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                )
            }
        </section>
    )
}

export default HaveSpinner;