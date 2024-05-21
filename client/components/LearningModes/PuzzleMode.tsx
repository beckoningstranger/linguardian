import { ItemToLearn } from "@/types";
import { useEffect, useState } from "react";
import { ReviewStatus } from "./LearnAndReview";

interface PuzzleModeProps {
  item: ItemToLearn;
  evaluate: Function;
  initialPuzzlePieces: string[];
}

export default function PuzzleMode({
  item,
  evaluate,
  initialPuzzlePieces,
}: PuzzleModeProps) {
  const [puzzlePieces, setPuzzlePieces] = useState([] as string[]);
  const [input, setInput] = useState("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [inputFieldStyling, setInputFieldStyling] = useState(
    "h-20 w-full rounded-md bg-slate-200 text-center text-xl"
  );

  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setInput("");
        setReviewStatus("neutral");
        setInputFieldStyling(
          "h-20 w-full rounded-md text-center text-xl bg-slate-200"
        );
        evaluate(reviewStatus, input);
      }, 1000);
    }
  }, [reviewStatus, evaluate, input]);

  useEffect(() => {
    setPuzzlePieces([...initialPuzzlePieces]);
  }, [initialPuzzlePieces]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === item.name) {
      setReviewStatus("correct");
      setInputFieldStyling(
        "h-20 w-full rounded-md text-center text-xl bg-green-300"
      );
    } else {
      setReviewStatus("incorrect");
      setInputFieldStyling(
        "h-20 w-full rounded-md text-center text-xl bg-red-400"
      );
    }
  };

  return (
    <div>
      <form className="grid place-items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Compose or enter the translation"
          value={input}
          className={inputFieldStyling}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          disabled={reviewStatus !== "neutral"}
        />
        <div className="m-2 flex w-full justify-around">
          <div
            onClick={() => {
              setInput("");
              setPuzzlePieces([...initialPuzzlePieces]);
            }}
            className="rounded-md bg-slate-200 p-3 px-5"
          >
            Reset
          </div>
          <button className="rounded-md bg-slate-200 p-3 px-5" type="submit">
            Submit
          </button>
        </div>
      </form>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {puzzlePieces.map((piece, index) => (
          <div
            className="rounded-md bg-slate-200 p-3 px-5 text-xl"
            key={index}
            onClick={() => {
              setInput(input + piece);
              puzzlePieces.splice(puzzlePieces.indexOf(piece), 1, "✅");
              setPuzzlePieces(puzzlePieces);
            }}
          >
            {piece}
          </div>
        ))}
      </div>
    </div>
  );
}
