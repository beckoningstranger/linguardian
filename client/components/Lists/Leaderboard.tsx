import { cn } from "@/lib/helperFunctionsClient";

interface LeaderboardProps {
  mode: "list" | "unit";
}
export default function Leaderboard({ mode }: LeaderboardProps) {
  return (
    <div
      className={cn(
        "row-start-4 bg-white/90 py-4 tablet:col-start-2 shadow-xl tablet:row-start-1 tablet:block tablet:rounded-md desktopxl:col-start-1 desktopxl:row-start-2 desktopxl:min-h-[400px]",
        mode === "list" &&
          "tablet:row-start-2 tablet:col-start-2 desktopxl:col-start-3 desktopxl:row-start-3"
      )}
    >
      <div className="grid h-full place-items-center">
        Leaderboard Placeholder
      </div>
    </div>
  );
}
