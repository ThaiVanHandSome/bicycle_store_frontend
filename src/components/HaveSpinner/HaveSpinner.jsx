import { Spinner } from "@nextui-org/react";

function HaveSpinner({ hideSpinner, children }) {
    return (
        <section className="relative min-h-[100vh] w-full">
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