interface FileInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  accept?: string;
  disabled?: boolean;
  error?: string;
}

export default function FileInput({ onChange, accept, disabled }: FileInputProps) {
  return <input type="file" onChange={onChange} accept={accept} disabled={disabled} />;
}
