import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { ApiError } from "../lib/fetcher";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";

type RedirectState = {
  from?: {
    pathname?: string;
  };
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.5 4.6 9 5.4a1 1 0 010 1.2 17 17 0 01-2.3 2.8M6.6 6.6A17 17 0 003 9.4a1 1 0 000 1.2C3.5 11.4 7 16 12 16c1 0 2-.2 2.9-.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function getServerError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "The email or password is incorrect.";
    }

    if (error.status === 422) {
      return "Please check the information you entered.";
    }

    return error.message;
  }

  return "Unable to sign in. Please try again.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const loginMutation = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      workspace: "the-address",
    },
  });

  const selectedWorkspace = useWatch({
    control,
    name: "workspace",
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await loginMutation.mutateAsync(values);

      const token = response.token ?? response.access_token;

      if (!token) {
        throw new Error(
          "The login response did not contain an authentication token.",
        );
      }

      setToken(token);

      const state = location.state as RedirectState | null;

      const destination = state?.from?.pathname ?? "/";

      navigate(destination, {
        replace: true,
      });
    } catch {
      // React Query exposes the error through loginMutation.error.
    }
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#dfdbce]">
      {/* Background image */}
      <div
        className="absolute inset-x-0 top-0 h-[78%] bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/login-background.jpg')",
        }}
      />

      {/* Dark image overlay */}
      <div className="absolute inset-x-0 top-0 h-[78%] bg-black/30" />

      {/* Bottom cream fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-b from-transparent via-[#dfdbce]/90 to-[#dfdbce]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 px-6 py-10 lg:grid-cols-[1fr_500px] lg:gap-14 lg:px-16 lg:py-24">
        {/* Left marketing section */}
        <section className="hidden max-w-[720px] text-[#e5e2d5] lg:block">
          <img
            src="/assets/keystone-logo.svg"
            alt="Keystone"
            className="h-auto w-32"
          />

          <div className="mt-20">
            <h1 className="max-w-[700px] font-serif text-5xl font-medium capitalize leading-[1.25] xl:text-[55px]">
              The Best Commercial Real Estate Opportunities In And Around Egypt
            </h1>

            <p className="mt-8 text-2xl italic">
              Your Key To Better Investments ..
            </p>
          </div>
        </section>

        {/* Login card */}
        <section className="flex items-start justify-center lg:pt-10">
          <div className="w-full max-w-[500px] rounded-2xl border border-white/20 bg-[#262626]/15 px-6 py-8 shadow-[39px_-41px_51px_rgba(95,95,95,0.11)] backdrop-blur-md sm:px-10 lg:px-12">
            <div className="text-center">
              <img
                src="/assets/logo.svg"
                alt=""
                className="mx-auto h-auto w-24"
              />

              <h2 className="mt-5 text-2xl font-bold text-[#dfdbce]">
                Welcome!
              </h2>

              <p className="mx-auto mt-2 max-w-[335px] text-sm italic leading-6 text-white/90 sm:text-base">
                Sign In To Your Workspace To Keep The Pipeline Moving.
              </p>
            </div>

            <form className="mt-6" onSubmit={onSubmit} noValidate>
              {/* Workspace selector */}
              <fieldset>
                <legend className="sr-only">Select workspace</legend>

                <div className="grid grid-cols-2 rounded-xl border border-white/60 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("workspace", "the-address", {
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-lg px-4 py-2 text-sm text-[#dfdbce] transition sm:text-base ${
                      selectedWorkspace === "the-address"
                        ? "border border-white/30 bg-white/15 font-medium shadow-[3px_2px_6px_rgba(0,0,0,0.25)]"
                        : "hover:bg-white/10"
                    }`}
                  >
                    The Address
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setValue("workspace", "marq", {
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-lg px-4 py-2 text-sm text-[#dfdbce] transition sm:text-base ${
                      selectedWorkspace === "marq"
                        ? "border border-white/30 bg-white/15 font-medium shadow-[3px_2px_6px_rgba(0,0,0,0.25)]"
                        : "hover:bg-white/10"
                    }`}
                  >
                    MarQ
                  </button>
                </div>

                <input type="hidden" {...register("workspace")} />

                {errors.workspace ? (
                  <p className="mt-1 text-sm text-red-200">
                    {errors.workspace.message}
                  </p>
                ) : null}
              </fieldset>

              {/* Email */}
              <div className="mt-7">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#dfdbce] sm:text-base"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="User@theaddress.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                  className="mt-2 h-11 w-full rounded-xl border border-[#e3e3e3] bg-[#d9d9d9]/30 px-3 text-sm text-white outline-none placeholder:text-white/90 focus:border-white focus:ring-2 focus:ring-white/20"
                />

                {errors.email ? (
                  <p className="mt-1 text-sm text-red-200">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              {/* Password */}
              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#dfdbce] sm:text-base"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password here.."
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                    className="h-11 w-full rounded-xl border border-[#e3e3e3] bg-[#d9d9d9]/40 px-3 pr-11 text-sm text-white outline-none placeholder:text-white/90 focus:border-white focus:ring-2 focus:ring-white/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dfdbce] hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon hidden={!showPassword} />
                  </button>
                </div>

                {errors.password ? (
                  <p className="mt-1 text-sm text-red-200">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="text-sm text-white/90 hover:text-white hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {loginMutation.isError ? (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200/40 bg-red-950/30 px-3 py-2 text-sm text-red-100"
                >
                  {getServerError(loginMutation.error)}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#e5e2d5]/90 px-4 text-base font-medium text-black/70 shadow-[0_4px_17px_rgba(0,0,0,0.16)] transition hover:bg-[#e5e2d5] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </button>

              <p className="mt-4 text-center text-sm text-[#42413e]/50">
                Protected workspace - KEYSTONE
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
