import axios from "@/lib/axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UseAuthProps {
  middleware?: string;
  redirectIfAuthenticated?: string;
}

interface ErrorProps {
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

interface StatusProps {
  setStatus: React.Dispatch<React.SetStateAction<string | null>>;
}

interface RegisterProps extends ErrorProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginProps extends ErrorProps, StatusProps {
  email: string;
  password: string;
}

interface ForgotPasswordProps extends ErrorProps, StatusProps {
  email: string;
}

interface ResetPasswordProps extends ErrorProps, StatusProps {
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: UseAuthProps = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User>("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const loading = !user && !error;

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }: RegisterProps) => {
    await csrf();

    setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat() as string[]);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }: LoginProps) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat() as string[]);
      });
  };

  const forgotPassword = async ({
    setErrors,
    setStatus,
    email,
  }: ForgotPasswordProps) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat() as string[]);
      });
  };

  const resetPassword = async ({
    setErrors,
    setStatus,
    ...props
  }: ResetPasswordProps) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: router.query.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + window.atob(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat() as string[]);
      });
  };

  const resendEmailVerification = ({ setStatus }: StatusProps) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    loading,
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
