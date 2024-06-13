import clsx from "clsx";

function Status({status, icon, title, desc}) {
    return (
        <div className="flex">
            <div className={clsx("w-[45px] rounded-full flex items-center justify-center border-2 me-2", {
                "border-blue-600": status === "progress",
                "border-success-600": status === "success"
            })}>
                {icon}
            </div>
            <div>
                <p className={clsx("text-md font-bold", {
                    "text-success-600": status === "success"
                })}>{title}</p>
                <p className="text-sm">{desc}</p>
            </div>
        </div>
    );
}

export default Status;