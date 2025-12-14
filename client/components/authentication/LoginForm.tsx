"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import LandingPageFormContainer from "@/components/authentication/LandingPageFormContainer";
import LandingPageFormHeader from "@/components/authentication/LandingPageFormHeader";
import LandingPageInput from "@/components/authentication/LandingPageInput";
import FormErrors from "@/components/Forms/FormErrors";
import Spinner from "@/components/Spinner";
import Button from "@/components/ui/Button";
import paths from "@/lib/paths";
import {
    signinWithEmailSchema,
    SignInWithEmailSchema,
} from "@linguardian/shared/contracts";

export default function LoginForm() {
    const [signInError, setSignInError] = useState("");
    const [isSigningIn, setIsSigningIn] = useState<"" | "google" | "facebook">(
        ""
    );

    const methods = useForm<SignInWithEmailSchema>({
        resolver: zodResolver(signinWithEmailSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleCredentialsLogin = async (data: FieldValues) => {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setSignInError("Email or Password are incorrect");
            methods.reset();
            return;
        }
        window.location.href = paths.signInPath();
    };

    const allFieldsAreDirty =
        Object.keys(methods.formState.dirtyFields).length === 2;
    return (
        <FormProvider {...methods}>
            <LandingPageFormContainer>
                <LandingPageFormHeader title="Sign In" />
                <form
                    className="flex flex-col gap-3"
                    onSubmit={methods.handleSubmit(handleCredentialsLogin)}
                >
                    <fieldset
                        disabled={!!isSigningIn}
                        className="flex flex-col gap-3"
                    >
                        <LandingPageInput
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            autoFocus
                        />
                        <LandingPageInput
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                        />
                        <FormErrors
                            errors={methods.formState.errors}
                            field="root"
                            aria-live="polite"
                        />
                        {signInError.length > 0 && (
                            <p className="text-sm text-red-500">
                                {signInError}
                            </p>
                        )}
                        <Button
                            disabled={
                                methods.formState.isSubmitting ||
                                !allFieldsAreDirty ||
                                !methods.formState.isValid
                            }
                            intent="primary"
                            rounded
                            type="submit"
                        >
                            {methods.formState.isSubmitting ? (
                                <Spinner centered mini />
                            ) : (
                                "Login with Email"
                            )}
                        </Button>
                    </fieldset>
                </form>
                <div className="my-2 flex flex-col gap-y-2">
                    <div className="flex w-full justify-between gap-x-2">
                        <Button
                            color="white"
                            fullWidth
                            rounded
                            onClick={() => {
                                setIsSigningIn("google");
                                methods.clearErrors();
                                signIn("google", {
                                    callbackUrl: paths.signInPath(),
                                });
                            }}
                            aria-label="Sign in with Google"
                            disabled={
                                methods.formState.isSubmitting || !!isSigningIn
                            }
                        >
                            {isSigningIn === "google" ? (
                                <Spinner centered mini />
                            ) : (
                                <FcGoogle className="mx-auto text-2xl" />
                            )}
                        </Button>
                        <Button
                            color="blue"
                            fullWidth
                            rounded
                            onClick={() => {
                                setIsSigningIn("facebook");
                                signIn("facebook", {
                                    callbackUrl: paths.signInPath(),
                                });
                            }}
                            aria-label="Sign in with Facebook"
                            disabled
                            // disabled={isSubmitting || !!isSigningIn}
                        >
                            {isSigningIn === "facebook" ? (
                                <Spinner centered mini />
                            ) : (
                                <FaFacebook className="mx-auto text-2xl" />
                            )}
                        </Button>
                    </div>
                </div>
            </LandingPageFormContainer>
        </FormProvider>
    );
}
