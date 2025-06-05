import { cn } from "@/lib/helperFunctionsClient";

interface LeaderboardProps {
  mode: "list" | "unit";
}
export default function Leaderboard({ mode }: LeaderboardProps) {
  return (
    <div
      className={cn(
        "grid place-items-center mb-24 tablet:mb-0 row-start-4 h-24 tablet:h-auto bg-white/90 tablet:col-start-2 shadow-xl tablet:row-start-1 rounded-md desktopxl:col-start-1 desktopxl:row-start-2 desktopxl:min-h-[400px]",
        mode === "list" &&
          "tablet:row-start-2 tablet:col-start-2 desktopxl:col-start-3 desktopxl:row-start-3 desktopxl:mt-2"
      )}
      id="ListLeaderBoard"
    >
      Leaderboard Placeholder
    </div>
  );
}
