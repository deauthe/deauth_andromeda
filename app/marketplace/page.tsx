"use client";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import React, { useEffect, useState } from "react";

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
		<div className="flex flex-col mt-20 gap-5">
			<div className="flex">
				<Button className="mx-auto">Query MarketPlace</Button>
			</div>
			<div className="grid lg:grid-cols-5 grid-cols-4 gap-5">
				{["0", "1", "2", "0", "1", "2", "0", "1", "2"].map((item, index) => {
					return (
						<div
							key={index}
							className="bg-white/[0.7] rounded-lg shadow-md p-4"
						>
							<div className="flex justify-between w-full h-44">
								<img src="https://ipfs.io/ipfs/Qmdf274158639bBqZJG7wW4jLhXU1iYcV7yK7zF7sT1dD1" />
							</div>
							<div>
								<Button
									className=""
									onClick={() => {
										buyNft(item);
									}}
								>
									Buy
								</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MarketPlace;
