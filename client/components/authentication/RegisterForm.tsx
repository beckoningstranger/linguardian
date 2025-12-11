"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import FormErrors from "@/components/Forms/FormErrors";
import InputWithAvailabilityCheck from "@/components/authentication/InputWithAvailabilityCheck";
import LandingPageFormContainer from "@/components/authentication/LandingPageFormContainer";
import LandingPageFormHeader from "@/components/authentication/LandingPageFormHeader";
import LandingPageInput from "@/components/authentication/LandingPageInput";
import Spinner from "@/components/Spinner";

import { createUserAction } from "@/lib/actions/user-actions";

import paths from "@/lib/paths";
import { RegistrationData, registrationDataSchema } from "@/lib/contracts";

export default function RegisterForm() {
  const methods = useForm<RegistrationData>({
    resolver: zodResolver(registrationDataSchema),
    defaultValues: { registeredVia: "email" },
    mode: "onBlur",
  });

  const onSubmit = async (formData: RegistrationData) => {
    const response = await toast.promise(createUserAction(formData), {
      loading: "Creating user...",
      success: "User created successfully! 🎉",
      error: (err) => {
        const error: string =
          err instanceof Error ? err.message : err.toString();
        methods.setError("root", {
          type: "manual",
          message: error,
        });
        return error;
      },
    });

    if (response) {
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: paths.welcomePath(),
      });
    }
  };

  const { isSubmitting, isValid } = methods.formState;

  const requiredFields = ["username", "email", "password", "confirmPassword"];
  const allFieldsAreDirty = requiredFields.every((field) =>
    Object.keys(methods.formState.dirtyFields).includes(field)
  );

  return (
    <FormProvider {...methods}>
      <LandingPageFormContainer>
        <LandingPageFormHeader title="Create an account" />
        <form
          className="flex flex-col gap-1"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <InputWithAvailabilityCheck checkMode="username" />
          <InputWithAvailabilityCheck checkMode="email" />
          <LandingPageInput
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          <LandingPageInput
            type="password"
            id="confirmPassword"
            placeholder="Enter your password again"
          />
          <FormErrors
            errors={methods.formState.errors}
            field="root"
            aria-live="polite"
          />

          <Button
            intent="primary"
            disabled={isSubmitting || !allFieldsAreDirty || !isValid}
            type="submit"
            rounded
          >
            {isSubmitting ? <Spinner centered mini /> : "Register"}
          </Button>
        </form>
      </LandingPageFormContainer>
    </FormProvider>
  );
}
