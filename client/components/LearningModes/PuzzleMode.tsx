import { ItemToLearn } from "@/types";
import { useEffect, useState } from "react";
import { ReviewStatus } from "./TranslationMode";

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
        evaluate(reviewStatus);
      }, 1000);
    }
  }, [reviewStatus]);

  useEffect(() => {
    setPuzzlePieces([...initialPuzzlePieces]);
  }, [initialPuzzlePieces]);

  return (
    <div className="grid place-items-center">
      <input
        placeholder="Compose or enter the translation"
        className={inputFieldStyling}
        autoFocus
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <div className="m-2 flex w-full justify-around">
        <button
          onClick={() => {
            setInput("");
            setPuzzlePieces([...initialPuzzlePieces]);
          }}
          className="rounded-md bg-slate-200 p-3 px-5"
        >
          Reset
        </button>
        <button
          onClick={() => {
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
          }}
          className="rounded-md bg-slate-200 p-3 px-5"
        >
          Submit
        </button>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {puzzlePieces.map((piece, index) => (
          <button
            className="rounded-md bg-slate-200 p-3 px-5 text-xl"
            key={index}
            onClick={() => {
              setInput(input + piece);
              puzzlePieces.splice(puzzlePieces.indexOf(piece), 1, "✅");
              setPuzzlePieces(puzzlePieces);
            }}
          >
            {piece}
          </button>
        ))}
      </div>
    </div>
  );
}
