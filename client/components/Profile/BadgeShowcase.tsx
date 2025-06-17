export default function BadgeShowcase() {
  return (
    <div
      id="BadgeShowcase"
      className="flex flex-col gap-2 desktop:pt-12"
    >
      <p className="text-center font-serif text-hmd desktop:grid desktop:text-left">
        Badge Showcase
      </p>
      <div
        id="Badges"
        className="grid grid-cols-5 gap-2 tablet:grid-cols-10 desktop:min-w-[320px] desktop:grid-cols-5"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((badge) => (
          <div
            key={badge}
            className="size-[55px] rounded-md bg-blue-700 desktop:size-[55px]"
          />
        ))}
      </div>
    </div>
  );
}
