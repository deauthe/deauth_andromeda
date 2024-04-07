"use client";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { AndrAddress, query } from "@andromedaprotocol/andromeda.js";
import { all } from "axios";
import { log } from "console";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const DistributeNfts = (props: Props) => {
	const router = useRouter();
	const { data: code_id } = useGetCodeId("marketplace");
	const queryParams = useSearchParams();
	const refNftTokenId: string | null = queryParams.get("ref_nft");
	const contract_address: string | null = queryParams.get("contract_address");
	const [allNfts, setAllNfts] = useState<any>([]);
	const [image, setImage] = useState("");
	const [marketPlaceContractAddress, setMarketPlaceContractAddress] =
		useState<string>("");
	const [transactionWaiting, setTransactionWaiting] = useState(false);
	const client = useAndromedaClient();

	useEffect(() => {
		localStorage.setItem("ref_nft", refNftTokenId as string | "");
		localStorage.setItem("cw721_address", contract_address as string);
	}, [contract_address, refNftTokenId]);

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
			const refNft = await client
				?.queryContract(contract_address, queryMessage)
				.then((res) => {
					//@ts-ignore
					const token_uri = res?.info?.token_uri;
					const parsed_token_uri = JSON.parse(token_uri);
					const allNfts = parsed_token_uri?.children;
					setAllNfts(allNfts);
					localStorage.setItem("allNfts", allNfts);
					console.log("hello: ", allNfts);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const getNftImage = async () => {
		try {
			if (!allNfts || allNfts.length === 0) {
				console.log("nfts missing");
			}

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

	const sendNftsToMarket = async (all_nft_token_ids: string[]) => {
		if (!allNfts || allNfts.length === 0) {
			console.log("nfts missing");
			return;
		}
		const marketPlaceAddress: AndrAddress = marketPlaceContractAddress;
		if (marketPlaceAddress.length === 0) {
			console.log("no marketplace address");
			return;
		}

		try {
			if (!contract_address || !query || !client) {
				console.log("something missing c:", contract_address, " q:", query);
				return;
			}
			console.log(marketPlaceAddress);

			const nft1 = await client?.execute(contract_address!, {
				send_nft: {
					contract: marketPlaceAddress,
					token_id: all_nft_token_ids[0],
					msg: "eyJzdGFydF9zYWxlIjp7ImNvaW5fZGVub20iOiJ1YW5kciIsInN0YXJ0X3RpbWUiOm51bGwsImR1cmF0aW9uIjpudWxsLCJwcmljZSI6IjEwMDAifX0=",
				},
			});
			const nft2 = await client?.execute(contract_address!, {
				send_nft: {
					contract: marketPlaceAddress,
					token_id: all_nft_token_ids[1],
					msg: "eyJzdGFydF9zYWxlIjp7ImNvaW5fZGVub20iOiJ1YW5kciIsInN0YXJ0X3RpbWUiOm51bGwsImR1cmF0aW9uIjpudWxsLCJwcmljZSI6IjEwMDAifX0=",
				},
			});
			const nft3 = await client?.execute(contract_address!, {
				send_nft: {
					contract: marketPlaceAddress,
					token_id: all_nft_token_ids[2],
					msg: "eyJzdGFydF9zYWxlIjp7ImNvaW5fZGVub20iOiJ1YW5kciIsInN0YXJ0X3RpbWUiOm51bGwsImR1cmF0aW9uIjpudWxsLCJwcmljZSI6IjEwMDAifX0=",
				},
			});
			const nft4 = await client?.execute(contract_address!, {
				send_nft: {
					contract: marketPlaceAddress,
					token_id: all_nft_token_ids[3],
					msg: "eyJzdGFydF9zYWxlIjp7ImNvaW5fZGVub20iOiJ1YW5kciIsInN0YXJ0X3RpbWUiOm51bGwsImR1cmF0aW9uIjpudWxsLCJwcmljZSI6IjEwMDAifX0=",
				},
			});

			console.log("nft sent: ", nft1, nft2, nft3, nft4);
		} catch (error) {
			console.error(error);
		}
	};

	const instantiateMarketPlace = async () => {
		const instantiateQuery = {
			kernel_address: process.env.NEXT_PUBLIC_KERNEL_ADDRESS,
		};
		try {
			const contract = await client?.instantiate(
				code_id!,
				instantiateQuery,
				"label for marketPlace contract"
			);
			console.log("contract", contract);
			if (contract) {
				setMarketPlaceContractAddress(contract?.contractAddress);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const queryMarketPlace = async (all_nft_token_ids: string[]) => {
		for (const tokenId of all_nft_token_ids) {
			try {
				const query = {
					latest_sale_state: {
						token_id: tokenId,
						token_address: contract_address,
					},
				};

				if (!contract_address || !query || !client) {
					console.log("Something is missing:", contract_address, query);
					return;
				}

				const randomNft = await client?.queryContract(
					marketPlaceContractAddress!,
					query
				);
				console.log("NFT received:", randomNft);
			} catch (error) {
				console.error("Error querying MarketPlace:", error);
			}
		}
	};

	const buyNft = async (token_id: string) => {
		const query = {
			buy: {
				token_id,
				token_address: contract_address,
			},
		};
		if (!marketPlaceContractAddress || !query || !client) {
			console.log("Something is missing:", marketPlaceContractAddress, query);
			return;
		}
		try {
			const nft = await client?.execute(marketPlaceContractAddress, query);
			console.log("bought nft", nft);
		} catch (error) {}
	};

	return (
		<div className="mt-20">
			<Button
				onClick={() => {
					getAllNfts();
					getNftImage();
				}}
			>
				Get all NFTs to sell
			</Button>

			<Button
				onClick={() => {
					instantiateMarketPlace();
				}}
			>
				Instantiate MarketPlace
			</Button>

			<Button
				onClick={() => {
					sendNftsToMarket(allNfts);
				}}
			>
				List on the MarketPlace
			</Button>

			{allNfts && allNfts.length > 0 && (
				<div>
					<img className="size-44" src={image || ""} alt="image" />
					<h1>Total NFTs: {allNfts.length}</h1>
					<ul className="">
						{
							//@ts-ignore
							allNfts.map((nft, index) => {
								return (
									<li
										className="bg-white shadow-md p-2 m-1 flex justify-between w-1/2 mx-auto"
										key={index}
									>
										{nft}
										{}
										<Button onClick={() => buyNft(nft)} className="">
											Buy this Nft
										</Button>
									</li>
								);
							})
						}
						{}
					</ul>
				</div>
			)}

			<Button
				onClick={() => {
					queryMarketPlace(allNfts);
				}}
			>
				Query MarketPlace
			</Button>
		</div>
	);
};

export default DistributeNfts;
