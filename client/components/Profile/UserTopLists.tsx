import Image from "next/image";

import { LanguageWithFlagAndName, User } from "@linguardian/shared/contracts";

interface UserTopListsProps {
  language: LanguageWithFlagAndName;
  user: User;
}

export default function UserTopLists({ language, user }: UserTopListsProps) {
  const lists = [
    { title: "Ensemble - C'est tout", image: "", competency: 820 },
    {
      title: "Vocabulary from Stephen King's novels",
      image: "",
      competency: 470,
    },
    {
      title: "Random words I want to learn",
      image: "",
      competency: 20,
    },
  ];

  return (
    <div id={`TopLists-${language.name}`} className="px-4 py-2 tablet:px-8">
      <p className="mb-4 font-serif text-hlg">
        {user.username}&apos;s Top Lists
      </p>
      <div className="flex flex-col gap-2 text-cxlm">
        {lists.map((list) => (
          <div
            key={list.title}
            id={`ListInfo-${list.title}`}
            className="flex items-center justify-between gap-5"
          >
            <div
              id={`Image|Title-${list.title}`}
              className="flex items-center gap-2"
            >
              {list.image ? (
                <Image
                  src={list.image}
                  height={56}
                  width={56}
                  alt=""
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-[56px] min-w-[56px] rounded-full bg-yellow-300" />
              )}
              <p className="text-clgm leading-tight tablet:text-cxlm">
                {list.title}
              </p>
            </div>
            <div
              id={`ListCompetency-${list.title}`}
              className="flex justify-end gap-[2px] text-clgb"
            >
              <p>{list.competency}</p>
              <Image
                src="/icons/CrownBlack.svg"
                alt=""
                height={24}
                width={24}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
