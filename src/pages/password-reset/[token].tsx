import {
  ApplicationLogo,
  AuthCard,
  AuthSessionStatus,
  AuthValidationErrors,
  Button,
  Input,
  Label,
} from "@/components";
import { GuestLayout } from "@/components/layouts";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";

const PasswordReset: NextPage = () => {
  const router = useRouter();

  const { resetPassword } = useAuth({ middleware: "guest" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await resetPassword({
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
      setStatus,
    });
  };

  useEffect(() => {
    const email = router.query?.email as string;

    setEmail(email || "");
  }, [router.query.email]);

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
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>

            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              className="block mt-1 w-full"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button>Reset Password</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default PasswordReset;
