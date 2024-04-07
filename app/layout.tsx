import React, { ReactNode } from "react";
import Providers from "./providers";
import { Metadata } from "next";
import PoweredByLogo from "@/modules/ui/PoweredByLogo";
import "@/styles/globals.css";

import Navbar from "@/components/NavBar/Navbar";
import Image from "next/image";
export const metadata: Metadata = {
  title: {
    default: "Andromeda Nextjs Starter",
    template: "%s | App Name",
  },
};

interface Props {
  children?: ReactNode;
}

const RootLayout = async (props: Props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body className="bg-red-700 z-40">
        <Image
          src={"/HeroBanner.gif"}
          alt="haha"
          layout="fill"
          objectFit="cover"
          className="object-fill -z-10 "
        />
        <Providers>
          <Navbar />

          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
