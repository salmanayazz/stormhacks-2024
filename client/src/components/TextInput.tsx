interface TextInputProps {
  placeholder?: string;
  textValue?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function TextInput({
  placeholder,
  textValue = "",
  onChange,
}: TextInputProps) {
  return (
    <input
      value={textValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
