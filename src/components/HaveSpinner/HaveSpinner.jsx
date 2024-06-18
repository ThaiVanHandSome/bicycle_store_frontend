import { Spinner } from "@nextui-org/react";

function HaveSpinner({ showSpinner, children }) {
    return (
        <section className="relative min-h-[400px] w-full">
            {
                showSpinner ? (
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