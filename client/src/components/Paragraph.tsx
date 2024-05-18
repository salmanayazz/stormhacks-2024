interface ParagraphProps {
  text: string;
}

export default function Paragraph({ text }: ParagraphProps) {
  return <p>{text}</p>;
}
