import { PuzzlePieceObject } from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReviewStatus } from "./LearnAndReview";
import Button from "../ui/Button";

interface PuzzleModeProps {
  itemName: string;
  evaluate: Function;
  initialPuzzlePieces: PuzzlePieceObject[];
}

export default function PuzzleMode({
  itemName,
  evaluate,
  initialPuzzlePieces,
}: PuzzleModeProps) {
  const [puzzlePieces, setPuzzlePieces] = useState(
    [] as (PuzzlePieceObject & { used: boolean })[]
  );
  const resetPuzzlePieces = useCallback(() => {
    setPuzzlePieces(
      initialPuzzlePieces.map((piece) => ({ ...piece, used: false }))
    );
  }, [initialPuzzlePieces]);

  const [input, setInput] = useState("");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [inputFieldStyling, setInputFieldStyling] = useState(
    "h-20 w-full rounded-md bg-slate-200 text-center text-xl"
  );
  const keyListener = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      keyListener.current &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    ) {
      keyListener.current.setAttribute("readonly", "readonly");
    }
  }, []);

  const numberKeys = useMemo(
    () => Array.from({ length: puzzlePieces.length }, (_, i) => String(i + 1)),
    [puzzlePieces]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lastTypedKey = e.target.value[e.target.value.length - 1];
    if (numberKeys.includes(lastTypedKey)) {
      setPuzzlePieces((prevPuzzlePieces) =>
        prevPuzzlePieces.map((piece, i) =>
          i === +lastTypedKey - 1 && !piece.used
            ? { ...piece, used: true }
            : piece
        )
      );
      setInput(input + puzzlePieces[+lastTypedKey - 1].content);
    } else {
      setInput(e.target.value);
    }
  };

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (input === itemName) {
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
    },
    [input, itemName]
  );

  useEffect(() => {
    if (
      (puzzlePieces &&
        puzzlePieces.length > 0 &&
        puzzlePieces.every((piece) => piece.used) &&
        reviewStatus === "neutral") ||
      (input === itemName && reviewStatus === "neutral")
    ) {
      handleSubmit();
    }
  }, [puzzlePieces, handleSubmit, input, itemName, reviewStatus]);

  useEffect(() => {
    resetPuzzlePieces();
  }, [resetPuzzlePieces]);

  useEffect(() => {
    if (reviewStatus !== "neutral") {
      setTimeout(() => {
        setInput("");
        setReviewStatus("neutral");
        setInputFieldStyling(
          "h-20 w-full rounded-md text-center text-xl bg-slate-200"
        );
        setPuzzlePieces([]);
        evaluate(reviewStatus, input);
      }, 1000);
    }
    if (reviewStatus === "neutral" && keyListener.current)
      keyListener.current.focus();
  }, [reviewStatus, evaluate, input]);

  return (
    <div className="mx-1">
      <form className="grid place-items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Compose or enter the translation"
          value={input}
          onChange={handleChange}
          className={inputFieldStyling}
          disabled={reviewStatus !== "neutral"}
          ref={keyListener}
        />
        <div className="m-2 flex w-full justify-around gap-x-8">
          <Button
            onClick={() => {
              setInput("");
              resetPuzzlePieces();
              keyListener.current?.focus();
            }}
            intent="secondary"
            className="flex-1 py-4"
            disabled={reviewStatus !== "neutral"}
          >
            Reset
          </Button>
          <Button
            intent="primary"
            type="submit"
            className="flex-1 py-4"
            disabled={reviewStatus !== "neutral"}
          >
            Submit
          </Button>
        </div>
      </form>
      <div className="mt-8 grid grid-cols-2 gap-8">
        {puzzlePieces.map((piece, index) => (
          <Button
            className="relative text-xl text-black"
            key={index}
            noRing
            onClick={() => {
              setInput(input + piece.content);
              const updatedPuzzlePieces = puzzlePieces.map((piece, i) =>
                i === index ? { ...piece, used: true } : piece
              );
              setPuzzlePieces(updatedPuzzlePieces);
            }}
            disabled={reviewStatus !== "neutral"}
          >
            <div className="absolute inset-0 -top-4 m-auto font-poppins text-2xl font-bold">
              {piece.used ? "" : index + 1}
            </div>
            <div
              className={`flex h-16 w-full min-w-32 items-center justify-center rounded-md ${
                piece.used ? "bg-transparent" : "bg-slate-200"
              } p-3 px-5`}
            >
              {!piece.used && piece.content}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
