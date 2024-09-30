"use client";
import paths from "@/lib/paths";
import { Input } from "@headlessui/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import Spinner from "../Spinner";
import InputWithCheck from "./InputWithCheck";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm();

  const inputStyling =
    "w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40";

  const onSubmit = async ({ username, email, password }: FieldValues) => {
    const res = await fetch("api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (res.ok) {
      reset();
      await signIn("credentials", {
        email,
        password,
        callbackUrl: paths.welcomePath(),
      });
    } else {
      console.error("User registration failed");
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="rounded-lg border-t-4 border-green-400 p-5 shadow-lg">
        <h1 className="my-4 text-xl font-bold">Create a Linguardian account</h1>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <InputWithCheck
            setValue={setValue}
            checkMode="username"
            setError={setError}
            register={register}
            watch={watch}
          />
          <FormErrors errors={errors} field="username" />

          <InputWithCheck
            setValue={setValue}
            checkMode="email"
            setError={setError}
            register={register}
            watch={watch}
          />
          <FormErrors errors={errors} field="email" />

          <Input
            {...register("password", {
              required: "Please pick a password to go with your email",
              minLength: {
                value: 8,
                message: "Your password should have at least 8 characters.",
              },
            })}
            type="password"
            placeholder="Password"
            className={inputStyling}
          />
          <FormErrors errors={errors} field="password" />

          <Input
            {...register("confirmPassword", {
              required: "Please enter your password again to check for typos",
              validate: (value) =>
                value === getValues("password") || "Passwords must match",
            })}
            type="password"
            placeholder="Please type your password again"
            className={inputStyling}
          />
          <FormErrors errors={errors} field="confirmPassword" />

          <button
            className="cursor-pointer bg-green-600 px-6 py-2 font-bold text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner centered size="mini" /> : "Register"}
          </button>

          <Link href={paths.rootPath()} className="mt-3 text-right text-sm">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

type FormErrorsProps = {
  errors: FieldErrors<FieldValues>;
  field: string;
};
function FormErrors({ errors, field }: FormErrorsProps) {
  const error = errors[field];
  const message =
    typeof error?.message === "string" ? error.message : undefined;
  return <div className="text-red-500">{message}</div>;
}
