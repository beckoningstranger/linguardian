import { Tab } from "@headlessui/react";

export default function StyledTab({ label }: { label: string }) {
  return (
    <Tab className="underline-offset-4 data-[selected]:underline">{label}</Tab>
  );
}
