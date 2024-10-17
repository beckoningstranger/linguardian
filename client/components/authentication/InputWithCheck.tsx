"use client";

import { isEmailTaken, isUsernameTaken } from "@/lib/actions";
import { useEffect, useState } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import { BiSolidErrorAlt } from "react-icons/bi";
import { useDebounce } from "use-debounce";
import Spinner from "../Spinner";
import { LandingPageInput } from "./LandingPageComponents";

type InputWithCheckProps = {
  setValue: Function;
  setError: Function;
  register: Function;
  watch: Function;
  checkMode: "email" | "username";
};

export default function InputWithCheck({
  setValue,
  setError: setFormError,
  checkMode,
  register,
  watch,
}: InputWithCheckProps) {
  const [debouncedValue] = useDebounce(watch(checkMode) || "", 500);
  const [status, setStatus] = useState({
    checking: false,
    error: false,
    checked: false,
  });

  useEffect(() => {
    if (debouncedValue.length > 4) {
      setStatus((prev) => ({ ...prev, checking: true }));
      (async () => {
        const isTaken =
          checkMode === "email"
            ? await isEmailTaken(debouncedValue)
            : await isUsernameTaken(debouncedValue);
        if (isTaken) {
          setFormError(checkMode, {
            type: "manual",
            message: `There already is an account with this ${checkMode}`,
          });
          setStatus((prev) => ({ ...prev, error: true }));
        } else {
          setValue(checkMode, debouncedValue);
          setFormError(checkMode, null);
          setStatus((prev) => ({ ...prev, error: false }));
        }
        setStatus((prev) => ({ ...prev, checked: true, checking: false }));
      })();
    }
  }, [debouncedValue, setValue, setFormError, checkMode]);

  return (
    <div className="relative">
      <LandingPageInput
        type={checkMode === "email" ? "email" : "text"}
        placeholder={checkMode === "email" ? "Your Email" : "Your username"}
        {...register(checkMode)}
      />
      {status.checked && !status.checking && (
        <div
          aria-live="polite"
          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
        >
          {status.error ? (
            <BiSolidErrorAlt className="text-xl text-red-500" />
          ) : (
            <CheckmarkIcon />
          )}
        </div>
      )}
      {status.checking && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
          <Spinner size="mini" />
        </div>
      )}
    </div>
  );
}
