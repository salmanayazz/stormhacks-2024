interface Header1Props {
  text: string;
}

export default function Header1({ text }: Header1Props) {
  return (
    <h1>{text}</h1>
  );
}
