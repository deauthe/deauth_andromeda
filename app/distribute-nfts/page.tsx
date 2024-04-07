"use client";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import { all } from "axios";
import { log } from "console";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const DistributeNfts = (props: Props) => {
	const router = useRouter();
	const queryParams = useSearchParams();
	const refNftTokenId: string | null = queryParams.get("ref_nft");
	const contract_address: string | null = queryParams.get("contract_address");
	const [allNfts, setAllNfts] = useState<any>([]);
	const [image, setImage] = useState();
	const client = useAndromedaClient();

	useEffect(() => {}, []);

	const getAllNfts = async () => {
		const queryMessage = {
			all_nft_info: {
				token_id: refNftTokenId,
				include_expired: false,
			},
		};

		try {
			if (!contract_address || !queryMessage || !client) {
				console.log(
					"something missing c:",
					contract_address,
					" q:",
					queryMessage
				);
				return;
			}
			const refNft = client
				?.queryContract(contract_address, queryMessage)
				.then((res) => {
					//@ts-ignore
					const token_uri = res?.info?.token_uri;
					const parsed_token_uri = JSON.parse(token_uri);
					const allNfts = parsed_token_uri?.children;
					setAllNfts(allNfts);
					console.log("hello: ", allNfts);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const getNftImage = async () => {
		try {
			if (!allNfts || allNfts.length === 0) return;

			const imageQuery = {
				all_nft_info: {
					token_id: allNfts[0],
					include_expired: false,
				},
			};

			console.log("mainToken", allNfts[0]);
			if (!contract_address || !imageQuery || !client) {
				console.log(
					"something missing c:",
					contract_address,
					" q:",
					imageQuery
				);
				return;
			}
			const randomNft = await client?.queryContract(
				contract_address,
				imageQuery
			);

			const parsedRandomNft = JSON.parse(randomNft?.info?.token_uri);
			console.log(parsedRandomNft?.image);

			setImage(parsedRandomNft?.image);
			console.log(randomNft);
		} catch (error) {
			// Handle errors here
			console.error("Error fetching NFT image:", error);
		}
	};

	return (
		<div className="mt-20">
			<Button
				onClick={() => {
					getAllNfts();
					getNftImage();
				}}
				className=""
			>
				get all nfts to sell
			</Button>
			<Button onClick={() => {}} className="">
				list on the marketPlace
			</Button>
			{allNfts && allNfts.length > 0 && (
				<div>
					<Image src={image || ""} alt="image" width={250} height={250} />
					<h1>total Nfts: {allNfts.length}</h1>
					<ul>
						{//@ts-ignore
						allNfts?.map((nft, index) => {
							return <li key={index}>{nft}</li>;
						})}
					</ul>
				</div>
			)}
		</div>
	);
};

export default DistributeNfts;
