interface ButtonProps {
  type?: "button" | "submit" | "reset";
  element: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  element,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
    >
      {element}
    </button>
  );
}
