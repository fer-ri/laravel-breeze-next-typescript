import Head from "next/head";
import { ReactNode } from "react";

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return (
    <div>
      <Head>
        <title>Laravel</title>
      </Head>

      <div className="font-sans text-gray-900 antialiased">{children}</div>
    </div>
  );
};

export default GuestLayout;
