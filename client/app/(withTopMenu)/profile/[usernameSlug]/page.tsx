import Image from "next/image";
import Flag from "react-world-flags";

import { getUserByUsernameSlug } from "@/lib/fetchData";

interface ProfilePageProps {
  params: { usernameSlug: string };
}

// export async function generateMetadata({
//   params: { usernameSlug },
// }: ProfilePageProps) {
//   const user = await getUserByUsernameSlug(usernameSlug);
//   return { title: `${user?.username}'s Profile` };
// }

// export async function generateStaticParams() {
//   return await getAllUsernameSlugs();
// }

export default async function ProfilePage({
  params: { usernameSlug },
}: ProfilePageProps) {
  const user = await getUserByUsernameSlug(usernameSlug);

  const totalItemsLearned = Object.values(
    user?.learnedItems ?? {}
  ).flat().length;
  const totalListsLearned = Object.values(
    user?.learnedLists ?? {}
  ).flat().length;

  // const totalListsLearned =

  return (
    <div
      className="relative grid px-2 py-6 tablet:p-8 desktop:place-items-center"
      id="ProfileMain"
    >
      <div
        id="UserOverview"
        className="relative flex w-full max-w-[1102px] flex-col items-center justify-center gap-4 rounded-md bg-white/90 p-4 pt-12 tablet:py-8 tablet:text-hmd desktop:flex-row desktop:justify-between desktop:p-8"
      >
        <div
          id="TotalCompetency"
          className="absolute -top-4 left-1/2 flex w-[300px] -translate-x-1/2 items-center gap-1 rounded-full bg-blue-700 px-6 py-4 font-serif text-hsm text-white tablet:-top-6 tablet:w-[370px] tablet:justify-center tablet:px-8 tablet:text-hmd"
        >
          <Image
            src={"/icons/Crown.svg"}
            height={30}
            width={30}
            alt=""
            className="size-[30px] tablet:size-[48px]"
          />
          <div>Total Competency: 726</div>
        </div>
        <div
          id="UserPicAndInfo"
          className="grid place-items-center gap-2 py-2 tablet:flex tablet:w-[600px] tablet:items-center tablet:justify-center tablet:gap-12 tablet:pt-8 desktop:w-auto desktop:justify-start"
        >
          <div
            className="relative"
            id="ProfilePicNativeLanguageStreak"
          >
            {user?.image && (
              <Image
                src={user?.image}
                alt="User image"
                height={50}
                width={50}
                priority
                className="size-[200px] rounded-full"
                id="UserPic"
              />
            )}
            <Flag
              code={user?.native.flag}
              className="absolute bottom-0 left-0 size-[80px] rounded-full object-cover"
              id="UserNativeLanguageFlag"
            />
            <div
              className="absolute bottom-0 right-0 flex size-[80px] items-center justify-center rounded-full bg-blue-700 text-white"
              id="StreakCounter"
            >
              <Image
                src={"/icons/Lightning.svg"}
                height={35}
                width={35}
                alt=""
                className="size-[35px]"
              />
              <div className="font-sans text-clgm">22</div>
            </div>
          </div>
          <div
            id="BasicInfo"
            className="flex flex-col items-center justify-center gap-1 text-clgm tablet:items-start tablet:gap-4"
          >
            <p
              className="font-serif text-hlg tablet:text-hxl"
              id="Username"
            >
              {user?.username}
            </p>
            <div
              id="LanguagesUserLearns"
              className="flex items-center gap-2 px-4 tablet:px-0"
            >
              <p>is learning</p>
              {user?.learnedLanguages.map((lang) => (
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
        </div>
        {/* <div
          id="BadgeShowcase"
          className="flex flex-col gap-2 desktop:pt-12"
        >
          <p className="text-center font-serif text-hmd desktop:grid desktop:text-left">
            Badge Showcase
          </p>
          <div id="Badges" className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((badge) => (
              <div
                key={badge}
                className="size-[55px] rounded-md bg-blue-700 tablet:size-[75px] desktop:size-[63px]"
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
