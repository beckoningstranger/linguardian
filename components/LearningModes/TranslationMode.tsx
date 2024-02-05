interface TranslationModeProps {
  id: number;
  source: string;
  target: string;
}

export default function TranslationMode({
  id,
  source,
  target,
}: TranslationModeProps) {
  return (
    <div>
      TranslationMode, Target Language: {target}, You are a native speaker of{" "}
      {source}
    </div>
  );
}
