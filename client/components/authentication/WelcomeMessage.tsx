import Spinner from "../Spinner";

type WelcomeMessageProps = { mode: "login" | "register" };

export default function WelcomeMessage({ mode }: WelcomeMessageProps) {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center justify-center text-2xl font-bold text-white">
        <div>
          Welcome to Linguardian! We{" "}
          {mode === "login" ? "are logging you in" : "will set you up shortly"}
          ...
        </div>
        <Spinner size="big" />
      </div>
    </div>
  );
}
