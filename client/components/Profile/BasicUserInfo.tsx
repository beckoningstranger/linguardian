import Flag from "react-world-flags";

import { User } from "@/lib/contracts";

interface BasicUserInfoProps {
  user: User;
}

export default function BasicUserInfo({ user }: BasicUserInfoProps) {
  const totalItemsLearned = Object.values(user.learnedItems ?? {}).flat()
    .length;
  const totalListsLearned = Object.values(user.learnedLists ?? {}).flat()
    .length;

  return (
    <div
      id="BasicInfo"
      className="flex flex-col items-center justify-center gap-1 text-cxlm tablet:items-start tablet:gap-4"
    >
      <p className="font-serif text-hlg" id="Username">
        {user.username}
      </p>
      <div
        id="LanguagesUserLearns"
        className="flex items-center gap-2 px-4 tablet:px-0"
      >
        <p>is learning</p>
        {user.learnedLanguages.map((lang) => (
          <Flag
            key={lang.flag}
            code={lang.flag}
            className="size-[45px] rounded-full object-cover"
          />
        ))}
      </div>
      <p>
        {totalItemsLearned} items in {totalListsLearned} lists
      </p>
    </div>
  );
}
