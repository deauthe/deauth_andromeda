"use client";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomModal from "@/components/ModalWindow/modal";
type Props = {};

const MarketPlace = (props: Props) => {
  const [nfts, setNfts] = useState();
  const [loading, setLoading] = useState(true);
  const [cw721_address, setCw721Address] = useState<string | undefined>();
  const [marketPlaceContractAddress, setMarketPlaceContractAddress] = useState<
    string | undefined
  >();
  const client = useAndromedaClient();

  useEffect(() => {
    const fetchFromMarketPlace = async () => {
      setLoading(false);
    };
    const getcw721ContractAddress = async () => {
      setCw721Address("");
    };
    fetchFromMarketPlace();
  });

  const buyNft = async (token_id: string) => {
    setLoading(true);

    const query = {
      buy: {
        token_id,
        token_address: cw721_address,
      },
    };
    if (!marketPlaceContractAddress || !query || !client) {
      console.log("Something is missing:", marketPlaceContractAddress, query);
      return;
    }
    try {
      const nft = await client?.execute(marketPlaceContractAddress, query);
      console.log("bought nft", nft);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col mt-3 gap-2 justify-center ">
      <div className="flex">
        <Button className="mx-auto">Query MarketPlace</Button>
      </div>
      <div className="grid lg:grid-cols-4  grid-cols-4 gap-9 relative  mt-[6em] ">
        {["0", "1", "2", "0", "1", "2", "0", "1", "2"].map((item, index) => {
          return (
            <div key={index}>
              <div
                key={index}
                className="relative w-full h-full m-auto rounded-lg shadow-md p-4 overflow-hidden border-3 border-red-400 "
                style={{
                  height: "250px",
                  width: "350px",
                }}
              >
                {/* Background Image */}
                <Image
                  src="/NFT-Frame.png"
                  layout="fill"
                  objectFit="contain"
                  alt="NFT Frame"
                  className="absolute inset-0 z-20"
                />

                {/* Foreground Image */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] h-[187px] z-10 -mt-3">
                  <Image
                    src="/marketplace.webp"
                    layout="fill"
                    objectFit="cover"
                    alt="NFT Image"
                    className="z-10"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2   bg opacity-100 hover:opacity-100 w-[320px] h-[180px] cursor-pointer z-40">
                <p className=" mt-0 pt-3 pl-4   ">
                  <span
                  className="bg-red-400 p-2  rounded-lg font-extrabold" 
                  >1/100</span>
                </p>
                </div>
              </div>

             <div className="flex justify-center">
             <CustomModal/>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default MarketPlace;
