import { Button } from "@nextui-org/react";
import clsx from "clsx";

function ButtonCustom({
  ref,
  color = "success",
  size = "md",
  type = "solid",
  radius = "none",
  onClick,
  children,
  className,
}) {
  const classNames = clsx("bg-pri", className);
  return (
    <Button
      ref={ref}
      className={classNames}
      color={color}
      size={size}
      type={type}
      radius={radius}
      onClick={onClick}
    >
      <span className="text-lg font-bold text-white">{children}</span>
    </Button>
  );
}

export default ButtonCustom;
