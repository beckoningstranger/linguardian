"use client";

import { isEmailTaken, isUsernameTaken } from "@/lib/actions";
import { Input } from "@headlessui/react";
import { useEffect, useState } from "react";
import { CheckmarkIcon } from "react-hot-toast";
import { BiSolidErrorAlt } from "react-icons/bi";
import { useDebounce } from "use-debounce";
import Spinner from "../Spinner";

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

  const MINIMUM_USERNAME_LENGTH = 4;
  const MINIMUM_EMAIL_LENGHT = 7;

  const usernameValidation = {
    required: "Choosing a username is required",
    minLength: {
      value: MINIMUM_USERNAME_LENGTH,
      message: "Your username must be between 4 and 24 characters",
    },
    maxLength: {
      value: 24,
      message: "Your username must be between 4 and 24 characters",
    },
  };

  const emailValidation = {
    required: "You must enter a valid email address",
  };

  useEffect(() => {
    if (
      debouncedValue.length >
      (checkMode === "email" ? MINIMUM_EMAIL_LENGHT : MINIMUM_USERNAME_LENGTH)
    ) {
      if (checkMode === "email" && !isValidEmail(debouncedValue)) {
        setFormError("email", {
          type: "manual",
          message: `This is not a valid ${checkMode}`,
        });
        return;
      }
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
      <Input
        type={checkMode === "email" ? "email" : "text"}
        placeholder={checkMode === "email" ? "Your Email" : "Your username"}
        className={`w-[400px] border bg-zinc-100/40 px-6 py-2 pr-10`}
        {...register(
          checkMode,
          checkMode === "email" ? emailValidation : usernameValidation
        )}
      />
      {status.checked && !status.checking && (
        <div
          aria-live="polite"
          className="absolute right-3 top-1/2 -translate-y-1/2 transform"
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

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
