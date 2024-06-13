import { Button } from "@nextui-org/react";
import clsx from "clsx";

function ButtonCustom({
  ref,
  type,
  color = "success",
  size = "md",
  variant = "solid",
  radius = "none",
  onClick,
  children,
  className,
}) {
  const classNames = clsx("bg-pri", className);
  return (
    <Button
      ref={ref}
      type={type}
      className={classNames}
      color={color}
      size={size}
      variant={variant}
      radius={radius}
      onClick={onClick}
    >
      <span className="text-lg font-bold text-white">{children}</span>
    </Button>
  );
}

export default ButtonCustom;
