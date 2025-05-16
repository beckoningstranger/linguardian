import ListSearchInput from "../../ui/ListSearchInput";

interface ListSearchProps {}

export default function ListSearch({}: ListSearchProps) {
  return (
    <div className="flex flex-col gap-4 bg-white/80 px-1 py-2 tablet:px-4">
      <div className="flex items-center">
        <ListSearchInput />
      </div>
      <div className="text-center font-serif text-hsm font-semibold">
        Showing Most Popular Textbook Lists for Intermediates
      </div>
    </div>
  );
}
