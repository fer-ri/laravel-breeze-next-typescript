import {
  ApplicationLogo,
  AuthCard,
  AuthSessionStatus,
  AuthValidationErrors,
  Button,
  Label,
  Input,
  LoadingScreen,
} from "@/components";
import { GuestLayout } from "@/components/layouts";
import { useAuth } from "@/hooks/use-auth";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Page: NextPage = () => {
  const router = useRouter();

  const { loading, login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const reset = router.query?.reset as string;

      if (reset && errors.length === 0) {
        try {
          setStatus(window.btoa(reset));
        } catch (_) {}
      } else {
        setStatus(null);
      }
    }
  }, [router]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await login({ email, password, setErrors, setStatus });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <a>
              <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
            </a>
          </Link>
        }
      >
        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={status} />

        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              className="block mt-1 w-full"
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              className="block mt-1 w-full"
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <label htmlFor="remember_me" className="inline-flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                name="remember"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />

              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link href="/forgot-password">
              <a className="underline text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </a>
            </Link>

            <Button className="ml-3">Login</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Page;
