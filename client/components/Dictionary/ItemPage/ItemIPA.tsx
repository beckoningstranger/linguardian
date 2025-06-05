interface ItemIPAProps {
  IPA?: string[];
}

export default function ItemIPA({ IPA }: ItemIPAProps) {
  if (!IPA || IPA.length === 0) return null;

  return (
    <p className="font-IPA text-cxlb text-grey-800">
      {IPA.map((ipa, index) => (
        <span key={index}>/{ipa}/ </span>
      ))}
    </p>
  );
}
