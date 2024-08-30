"use client";

import BottomRightButton from "../BottomRightButton";

export default function DictionaryBottomRightButton() {
  function doThis() {
    console.log("BEEP");
  }

  return <BottomRightButton onClickDoThis={doThis} />;
}
