"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CheckmarkIcon } from "react-hot-toast";
import { BiSolidErrorAlt } from "react-icons/bi";
import { useDebounce } from "use-debounce";

import LandingPageInput from "@/components/authentication/LandingPageInput";
import Spinner from "@/components/Spinner";
import { isTakenAction } from "@/lib/actions/user-actions";
import { IsTakenMode } from "@/lib/contracts";
import { regexRules } from "@/lib/regexRules";

type InputWithCheckProps = {
  checkMode: IsTakenMode;
};

export default function InputWithAvailabilityCheck({
  checkMode,
}: InputWithCheckProps) {
  const { watch, setValue, setError, clearErrors } = useFormContext();

  const [debouncedValue] = useDebounce(watch(checkMode) || "", 1000);
  const [status, setStatus] = useState({
    checking: false,
    error: false,
    checked: false,
  });

  const isValidEmail = (email: string) => regexRules.email.pattern.test(email);

  const isValidUsername = (username: string) =>
    regexRules.username.pattern.test(username);

  const shouldCheck =
    (debouncedValue.length > 4 &&
      checkMode === "username" &&
      isValidUsername(debouncedValue)) ||
    (debouncedValue.length > 4 &&
      checkMode === "email" &&
      isValidEmail(debouncedValue));

  useEffect(() => {
    // If user hasn't typed anything meaningful, do nothing
    if (debouncedValue.length === 0) {
      clearErrors(checkMode);
      setStatus((prev) => ({
        ...prev,
        error: false,
        checked: false,
        checking: false,
      }));
      return;
    }

    // If value is still too short after debounce, show length error
    if (debouncedValue.length <= 4) {
      setError(checkMode, {
        type: "manual",
        message: "A minimum of 5 characters is required",
      });
      setStatus((prev) => ({
        ...prev,
        error: true,
        checked: true,
        checking: false,
      }));
    } else {
      clearErrors(checkMode); // prevent stacking error messages
    }
  }, [debouncedValue, checkMode, setError, clearErrors]);

  useEffect(() => {
    if (!shouldCheck && debouncedValue.length > 4)
      setError(checkMode, {
        type: "manual",
        message: regexRules[checkMode].message,
      });
  }, [shouldCheck, setError, checkMode, debouncedValue]);

  useEffect(() => {
    let isMounted = true;
    if (debouncedValue.length <= 4) return;

    if (!shouldCheck) {
      setError(checkMode, {
        type: "manual",
        message: regexRules[checkMode].message,
      });
      setStatus((prev) => ({
        ...prev,
        error: true,
        checked: true,
        checking: false,
      }));
      return;
    }

    setStatus((prev) => ({ ...prev, checking: true }));

    (async () => {
      const taken = await isTakenAction({
        mode: checkMode,
        value: debouncedValue,
      });

      if (taken) {
        setError(checkMode, {
          type: "manual",
          message: `There already is an account with this ${checkMode}`,
        });
        setStatus((prev) => ({ ...prev, error: true }));
      } else {
        setValue(checkMode, debouncedValue);
        clearErrors(checkMode);
        setStatus((prev) => ({ ...prev, error: false }));
      }
      setStatus((prev) => ({ ...prev, checked: true, checking: false }));
    })();

    return () => {
      isMounted = false;
    };
  }, [debouncedValue, setValue, setError, checkMode, clearErrors, shouldCheck]);

  return (
    <>
      <div className="relative">
        <LandingPageInput
          id={checkMode}
          type={checkMode === "email" ? "email" : "text"}
          placeholder={`Enter your ${checkMode}`}
          aria-invalid={status.error}
        />
        {status.checked && !status.checking && (
          <div aria-live="polite" className="absolute right-4 top-3">
            {status.error || !shouldCheck ? (
              <BiSolidErrorAlt className="text-xl text-red-500" />
            ) : (
              <CheckmarkIcon />
            )}
          </div>
        )}
        {status.checking && (
          <div className="absolute right-4 top-3">
            <Spinner mini />
          </div>
        )}
      </div>
    </>
  );
}
