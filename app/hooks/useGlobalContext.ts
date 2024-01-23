"use client";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined)
    throw new Error("Global Context was used outside of GlobalContextProvider");
  return context;
}
