"use client";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { AndrAddress, query } from "@andromedaprotocol/andromeda.js";
import { ChainClient } from "@andromedaprotocol/andromeda.js/dist/clients";
import {
	Coin,
	EncodeObject,
	isTxBodyEncodeObject,
} from "@cosmjs/proto-signing";
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

	const mainNftTokenId = localStorage.getItem("mainNftTokenId ");

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
					token_id: mainNftTokenId,
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
			console.log("random nft Image:", randomNft?.info?.token_uri);
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
			if (!contract_address || !client) {
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

	const batchSendNft = async (all_nft_token_ids: string[]) => {
		if (!allNfts || allNfts.length === 0) {
			console.log("nfts missing");
			return;
		}
		const marketPlaceAddress: AndrAddress = marketPlaceContractAddress;
		if (marketPlaceAddress.length === 0) {
			console.log("no marketplace address");
			return;
		}

		const funds: Coin[] = [];
		const endcoded_messages = all_nft_token_ids.map((item, index) => {
			return client?.chainClient?.encodeExecuteMsg(
				contract_address as string,
				{
					send_nft: {
						contract: marketPlaceAddress,
						token_id: item,
						msg: "eyJzdGFydF9zYWxlIjp7ImNvaW5fZGVub20iOiJ1YW5kciIsInN0YXJ0X3RpbWUiOm51bGwsImR1cmF0aW9uIjpudWxsLCJwcmljZSI6IjEwMDAifX0=",
					},
				},
				funds
			);
		});

		console.log("message", endcoded_messages);

		try {
			if (!contract_address || !client) {
				console.log("something missing c:", contract_address, " q:", query);
				return;
			}

			console.log(marketPlaceAddress);

			const sentNft = await client?.signAndBroadcast(
				endcoded_messages as EncodeObject[],
				"auto"
			);

			console.log("nft sent: ", sentNft);
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
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="mt-28 flex flex-col w-full justify-center">
			<div className="flex justify-center gap-5">
				<Button
					className="border-2 border-red-400 bg-red-300 p-5 text-black rounded-none hover:text-white "
					onClick={() => {
						instantiateMarketPlace();
					}}
				>
					1. Instantiate MarketPlace
				</Button>
				<Button
					className="border-2 border-red-400 bg-red-300 p-5 text-black rounded-none hover:text-white "
					onClick={() => {
						getAllNfts();
						getNftImage();
					}}
				>
					Get all NFTs to sell
				</Button>

				<Button
					className="border-2 border-red-400 bg-red-300 p-5 text-black rounded-none hover:text-white "
					onClick={() => {
						sendNftsToMarket(allNfts);
					}}
				>
					List on the MarketPlace
				</Button>

				<Button
					onClick={() => {
						queryMarketPlace(allNfts);
					}}
					className="border-2 border-red-400 bg-red-300 p-5 text-black rounded-none hover:text-white "
				>
					Query MarketPlace
				</Button>
				<Button
					onClick={() => {
						batchSendNft(allNfts);
					}}
					className="border-2 border-red-400 bg-red-300 p-5 text-black rounded-none hover:text-white "
				>
					batchSend
				</Button>
			</div>

			{allNfts && allNfts.length > 0 && (
				<div>
					{/* <img className="size-44" src={image || ""} alt="image" /> */}
					{/* <h1 className="text-white">Total NFTs: {allNfts.length}</h1> */}
					<ul className=" flex flex-col gap-1 items-center mt-[2em]">
						{
							//@ts-ignore
							allNfts.map((nft, index) => {
								return (
									<li
										className="border-2 border-red-400 shadow-md p-2 m-1 flex justify-between w-1/2 mx-auto text-white font-extrabold"
										key={index}
									>
										{nft}
										{}
										<Button
											onClick={() => buyNft(nft)}
											className="bg-red-400 rounded-none"
										>
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
		</div>
	);
};

export default DistributeNfts;
