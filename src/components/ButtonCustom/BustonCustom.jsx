import { Button } from "@nextui-org/react";
import clsx from "clsx";

function ButtonCustom({
  color = "success",
  size = "md",
  type = "solid",
  radius = "none",
  children,
  className,
}) {
  const classNames = clsx("bg-pri", className);
  return (
    <Button
      className={classNames}
      color={color}
      size={size}
      type={type}
      radius={radius}
    >
      <span className="text-lg font-bold text-white">{children}</span>
    </Button>
  );
}

export default ButtonCustom;
