"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "./hero.css";
import { useRouter } from "next/navigation";

const HeroBanner = () => {
  const router = useRouter();
  return (
    <div className="w-[100vw] h-[100vh] relative mt-9 overflow-y-none">
      <Image
        src={"/HeroBanner.gif"}
        alt="haha"
        layout="fill"
        objectFit="cover"
        className="object-fill z-10"
      />

      <Image
        src={"/HeroBannerText.png"}
        alt="HeroBannerText"
        width={400}
        height={100}
        className="z-10 absolute left-0 right-0 top-[2em] mx-auto w-1/2  font-header text-white"
      />

      <Image
        src={"/HeroBannerText2.png"}
        alt="HeroBannerText"
        width={400}
        height={100}
        className="z-10 absolute left-0 right-0 top-[15em] mx-auto w-1/2  font-header text-white"
      />

      <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-[36em] p-9 mx-auto flex gap-9">
        <button
          className="button  font-extrabold "
          onClick={() => {
            router.push("/Create");
          }}
        >
          Sell Your ART
        </button>

        <button
          className="button1   font-extrabold "
          onClick={() => {
            router.push("/marketplace");
          }}
        >
          Go to Marketplace
        </button>
      </div>

      <div className="w-5 h-5">
        <Image
          src={"/NFT-1.png"}
          alt="HeroBannerText"
          width={400}
          height={100}
          className="z-10 absolute left-[8em] top-[25em] mx-auto   font-header text-white w-[25em] h-[25em]"
        />
      </div>

      <Image
        src={"/NFT-2.png"}
        alt="HeroBannerText"
        width={400}
        height={100}
        className="z-10 absolute right-[8em] top-[25em] mx-auto   font-header text-white w-[25em] h-[25em] "
      />
    </div>
  );
};

export default HeroBanner;
