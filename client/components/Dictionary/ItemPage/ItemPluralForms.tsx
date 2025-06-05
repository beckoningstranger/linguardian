interface ItemPluralFormsProps {
  pluralForm?: string[];
}

export default function ItemPluralForms({ pluralForm }: ItemPluralFormsProps) {
  if (!pluralForm) return null;
  return (
    <>
      {pluralForm && pluralForm.length > 0 && pluralForm[0].length > 0 && (
        <div className="text-clgm">
          {pluralForm.length > 1 ? "plural forms: " : "plural form: "}
          {pluralForm.join(", ")}
        </div>
      )}
    </>
  );
}
