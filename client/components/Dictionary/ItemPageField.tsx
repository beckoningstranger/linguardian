interface ItemPageFieldProps {
  type: string;
  content: React.ReactNode;
}
export default function ItemPageField({ type, content }: ItemPageFieldProps) {
  return (
    <div>
      <h3 className="text-slate-400">{type}</h3>
      <div>{content}</div>
    </div>
  );
}
