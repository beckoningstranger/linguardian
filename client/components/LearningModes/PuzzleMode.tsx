"use client";

import { Button } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import { ReviewStatus } from "@/components";
import { PuzzlePieceObject } from "@/lib/contracts";
import { cn, shuffleArray } from "@/lib/utils";

interface PuzzleModeProps {
  itemName: string;
  evaluate: (status: ReviewStatus, solution: string) => void;
}

export default function PuzzleMode({ itemName, evaluate }: PuzzleModeProps) {
  const { orderedPuzzlePieces, shuffledPuzzlePieces } = useMemo(() => {
    const orderedPuzzlePieces = createPuzzlePieces(itemName);
    const shuffledPuzzlePieces = shuffleArray(orderedPuzzlePieces);
    return { orderedPuzzlePieces, shuffledPuzzlePieces };
  }, [itemName]);

  const userIsOnMobileDevice = useMemo(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    []
  );

  const [puzzlePieces, setPuzzlePieces] =
    useState<PuzzlePieceObject[]>(shuffledPuzzlePieces);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("neutral");
  const [solution, setSolution] = useState<PuzzlePieceObject[]>([]);
  const solutionString = solution.map((piece) => piece.content).join("");
  const validNumberKeys = orderedPuzzlePieces.map((_, i) => String(i + 1));

  const keyListener = useRef<HTMLInputElement | null>(null);

  const reset = useCallback(() => {
    setSolution([]);
    setReviewStatus("neutral");
    setPuzzlePieces(shuffledPuzzlePieces);
    keyListener.current?.focus();
  }, [
    setSolution,
    setReviewStatus,
    setPuzzlePieces,
    keyListener,
    shuffledPuzzlePieces,
  ]);

  // Prevent mobile keyboard from opening
  useEffect(() => {
    if (keyListener.current && userIsOnMobileDevice) {
      keyListener.current.setAttribute("readonly", "readonly");
    }
  }, [userIsOnMobileDevice]);

  useEffect(() => {
    if (puzzlePieces.every((piece) => piece.used)) {
      setReviewStatus(solutionString === itemName ? "correct" : "incorrect");
    }
  }, [puzzlePieces, reviewStatus, setReviewStatus, itemName, solutionString]);

  useEffect(() => {
    setPuzzlePieces(shuffledPuzzlePieces);
  }, [shuffledPuzzlePieces]);

  useEffect(() => {
    if (reviewStatus !== "neutral")
      setTimeout(() => {
        reset();
        evaluate(reviewStatus, solutionString);
      }, 1000);

    if (reviewStatus === "neutral") keyListener.current?.focus();
  }, [reviewStatus, evaluate, solutionString, reset]);

  const handlePieceSelection = (index: number) => {
    const piece = puzzlePieces[index];
    if (!piece || piece.used) return;

    setSolution((prev) => [...prev, piece]);
    setPuzzlePieces((prev) =>
      prev.map((piece, i) => (i === index ? { ...piece, used: true } : piece))
    );
  };

  return (
    <div className="grid gap-2 pt-1">
      <div
        id="Solution"
        className={cn(
          "w-full bg-white/95 py-6 justify-center font-serif flex",
          solutionString.length > 25 ? "text-hsm" : "text-hmd",
          reviewStatus === "correct" && "bg-green-300 animate-pulse",
          reviewStatus === "incorrect" && "bg-red-500"
        )}
      >
        {solution.length > 0 ? (
          solution.map((piece) => (
            <span
              className="whitespace-pre text-hmd tablet:text-hlg"
              key={piece.position}
            >
              {piece.content}
            </span>
          ))
        ) : (
          <span className="text-hsm text-grey-700 desktop:text-hlg">
            Puzzle this word&apos;s translation together
          </span>
        )}
      </div>

      <div className="grid place-items-center gap-y-4 px-4" id="PuzzleModeForm">
        <input
          type="text"
          tabIndex={-1}
          className="h-0"
          disabled={reviewStatus !== "neutral"}
          ref={keyListener}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              setSolution((prevSolution) => {
                if (prevSolution.length === 0) return prevSolution;

                const lastPiece = prevSolution[prevSolution.length - 1];

                setPuzzlePieces((prevPieces) => {
                  const index = prevPieces.findIndex(
                    (piece) => piece.position === lastPiece.position
                  );
                  if (index === -1) return prevPieces;

                  return prevPieces.map((piece, i) =>
                    i === index ? { ...piece, used: false } : piece
                  );
                });

                return prevSolution.slice(0, -1);
              });
            }
            if (e.key === "Escape") reset();
            if (validNumberKeys.includes(e.key)) {
              const index = +e.key - 1;
              const piece = puzzlePieces[index];
              if (!piece.used) {
                handlePieceSelection(index);
              }
            }
          }}
        />

        <div
          className="grid w-full grid-cols-2 grid-rows-3 gap-4 tablet:w-[600px] desktop:w-[800px] desktop:gap-x-12"
          id="PuzzlePieces"
        >
          {puzzlePieces.map((piece, index) => (
            <Button
              className={cn(
                "relative text-black rounded-md w-full py-6 flex justify-center drop-shadow-lg font-serif bg-white/95",
                piece.used && "opacity-30"
              )}
              key={index}
              onClick={() => handlePieceSelection(index)}
              disabled={reviewStatus !== "neutral"}
            >
              {!userIsOnMobileDevice && (
                <div
                  className={cn(
                    "flex items-center absolute left-8 font-sans text-c2xlb"
                  )}
                >
                  {index + 1}
                </div>
              )}
              <div className="text-hmd desktop:text-hlg">{piece.content}</div>
            </Button>
          ))}
        </div>

        <Button
          id="ResetButton"
          onClick={reset}
          className={cn(
            "transition-colors absolute bottom-0 tablet:bottom-4 inset-x-0 tablet:inset-x-4 tablet:left-1/2 tablet:w-[600px]  desktop:w-[800px] tablet:-translate-x-1/2 items-center gap-2 rounded-md bg-red-500 py-4 pl-2  text-white",
            reviewStatus !== "neutral" && "opacity-60"
          )}
          disabled={reviewStatus !== "neutral"}
        >
          <IoMdRefresh className="size-[50px]" />
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cxlb">
            Start over
          </p>
        </Button>
      </div>
    </div>
  );
}

function createPuzzlePieces(itemName: string): PuzzlePieceObject[] {
  const amountOfPieces = 6;
  const pieceLength = Math.ceil(itemName.length / amountOfPieces);
  const itemString = itemName;
  let puzzlePieces: string[] = [];

  for (let x = 0; x < amountOfPieces; x++) {
    puzzlePieces.push(itemString.slice(x * pieceLength, pieceLength * (x + 1)));
  }
  const puzzlePiecesWithoutEmptyOnes = puzzlePieces.filter(
    (piece) => piece.length > 0 && piece !== " "
  );

  const puzzlePieceObjects = puzzlePiecesWithoutEmptyOnes.map(
    (piece, index) => ({
      position: index + 1,
      content: piece,
      first: index === 0,
      last: index === puzzlePiecesWithoutEmptyOnes.length - 1,
      used: false,
    })
  );

  return puzzlePieceObjects;
}
