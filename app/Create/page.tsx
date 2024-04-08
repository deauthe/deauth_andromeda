"use client";
import CreateNftButton from "@/components/CreateNftButton/CreateNftButton";
import Wrapper from "@/components/Wrappers/Wrapper";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { Button } from "@/components/ui/button";
import { InstantiateOptions } from "@cosmjs/cosmwasm-stargate";
import React, { useEffect, useState } from "react";
import AndromedaClient from "@andromedaprotocol/andromeda.js";
import Image from "next/image";
import { randomNFTs } from "@/helpers/staticRandomNfts";
import { generateTokens, TokenData } from "@/helpers/generateTokenUri";
import { useRouter } from "next/navigation";
import { randomUUID } from "crypto";
import { v4 as uuidv4, V4Options } from "uuid";
import { useToast } from "@chakra-ui/react";

type Props = {};

const CreateNftPage = (props: Props) => {
	const serverAddr = process.env.NEXT_PUBLIC_SERVER_URL;
	const client = useAndromedaClient();
	const toast = useToast();
	const { data: code_id } = useGetCodeId("cw721");
	const [contract, setContract] = useState({});


	const [contractAddress, setContractAddress] = useState("");

	const [CW721contract, setCW721Contract] = useState("");

	const getDesignerDetails = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/designer/getDesignerDetails`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "deauthAndromeda",
					},
					body: JSON.stringify({
						walletAddr: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch designer details");
			}

			const data = await response.json();
			const { cw721_addr, associated_marketplace_addr } = data;
			console.log("api hit got contract addr 22", data);
			setCW721Contract(cw721_addr);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await getDesignerDetails();
			console.log("api done");
		};
		fetchData();
	}, []);

	const instantiate_contract = async () => {
		const cw721_instantiate_message = {
			name: "Deauth Token",
			symbol: "DT",
			minter: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
			kernel_address: process.env.NEXT_PUBLIC_KERNEL_ADDRESS,
		};

		try {
			const contract = await client?.instantiate(
				code_id!,
				cw721_instantiate_message,
				"this is a label"
			);
			console.log("contract", contract);
			if (contract) {
				setContract(contract);
				setContractAddress(contract?.contractAddress);
				// Add API POST request data here
				const postData = {
					wallet_addr: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
					associated_marketplace_addr: process.env.NEXT_PUBLIC_MARKETPLACE_ADDR,
					cw721_addr: contract?.contractAddress,
				};
				console.log(postData);
				await postDataToAPI(postData);
				toast({
					title: "Designer created successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Failed to create designer",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const postDataToAPI = async (data: any) => {
		try {
			const response = await fetch(`${serverAddr}/api/designer/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": "deauthAndromeda",
				},
				body: JSON.stringify(data),
			});
			if (response.ok) {
				console.log("Designer created successfully");
			} else {
				console.error("Failed to create designer:", response.statusText);
			}
		} catch (error) {
			console.error("Error creating designer:", error);
		}
	};

	return (
		<Wrapper>
			<div className="mt-20  w-full relative  ">
				<Button
					className=" text-white px-5 mt-5 absolute my-8 -top-[8em]  left-1/2 transform -translate-x-1/2 bg-red-400 rounded-none  "
					onClick={() => instantiate_contract()}
				>
					Instantiate Contract
				</Button>
				<CreateNftButton
					andromeda_client={client}
					wallet_address={
						process.env.NEXT_PUBLIC_WALLET_ADDRESS
							? process.env.NEXT_PUBLIC_WALLET_ADDRESS
							: "andr12yss47wjjqufx9jle8mjscal3jravrejns5km1"
					}
				/>

				<NftArea client={client} contract_address={CW721contract} />
			</div>
		</Wrapper>
	);
};

//find out a way to get individual images of all the nft's in the carousel
const NftArea = ({
	contract_address,
	client,
}: {
	contract_address: string;
	client: AndromedaClient | undefined;
}) => {
	console.log("NFT AREA ADDR", contract_address);
	const [mainNftTokenId, setMainNftTokenId] = useState<string>("");
	const [image, setImage] = useState("");
	const [nfts, setNfts] = useState([""]);

	useEffect(() => {
		// Get count from localStorage when component mounts
		const tokenId = localStorage.getItem("mainNftTokenId");
		setMainNftTokenId(tokenId as string);

		// Add event listener for storage changes
		const handleStorageChange = () => {
			const newTokenId = localStorage.getItem("mainNftTokenId");
			setMainNftTokenId(newTokenId as string);
		};

		window.addEventListener("storage", handleStorageChange);

		// Cleanup function to remove the listener on unmount
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const queryAllNfts = async () => {
		const queryMessage = {
			all_tokens: {
				limit: 100,
			},
		};
		const imageQuery = {
			all_nft_info: {
				token_id: mainNftTokenId,
				include_expired: false,
			},
		};
		try {
			const nfts = await client?.queryContract(contract_address, queryMessage);
			setNfts(nfts);
			if (mainNftTokenId) {
				console.log("mainToken", mainNftTokenId);
				const mainNft = await client?.queryContract(
					contract_address,
					imageQuery
				);
				const parsedMainNft = JSON.parse(mainNft?.info?.token_uri);
				console.log(parsedMainNft?.image);

				setImage(parsedMainNft?.image);
				console.log(mainNft);
			}

			console.log(nfts);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="w-fullflex mt-10 h-fit flex-col ">
			<div className="w-fit mx-auto">
				<Button
					onClick={queryAllNfts}
					className="mx-auto bg-red-400 rounded-none "
				>
					Get All Child Nfts
				</Button>
			</div>
			<div className="grid grid-cols-4 gap-5 my-10 mx-auto">
				{
					//@ts-ignore
					nfts?.tokens?.length >= 0 &&
						//@ts-ignore
						nfts.tokens.map((item, index) => (
							<div key={index} className="size-44  rounded-lg">
								{image ? (
									<Image
										className="mx-auto"
										alt="nftImage"
										src={image}
										width={150}
										height={150}
									/>
								) : (
									<div className="p-1 bg-blue-300"></div>
								)}
							</div>
						))
				}
			</div>
			{
				//@ts-ignore
				nfts?.tokens?.length >= 0 && (
					//@ts-ignore
					<SellButton
						mainNftTokenId={mainNftTokenId}
						allNftsIds={nfts}
						contract_address={contract_address}
					/>
				)
			}
		</div>
	);
};

const SellButton = ({
	mainNftTokenId,
	allNftsIds,
	contract_address,
}: {
	mainNftTokenId: string;
	allNftsIds: any[];
	contract_address: string;
}) => {
	const client = useAndromedaClient();
	const [isLoading, setLoading] = useState(false);

	const router = useRouter();

	const sell = async () => {
		setLoading(true);
		createNfts();
	};

	const createReferenceNft = async (allNfts: TokenData[]) => {
		const reference_nft_token_id = uuidv4();
		const tokenUris = allNfts.map((nft, index) => {
			const token_id = nft?.token_id;
			return token_id;
		});

		const token_uri = JSON.stringify({ children: tokenUris });
		const queryMessage = {
			mint: {
				token_id: reference_nft_token_id,
				owner: process.env.NEXT_PUBLIC_CONTRACT_OWNER,
				token_uri: token_uri,
				extension: {
					publisher: "Andromeda",
				},
			},
		};
		const createdRefNft = await client
			?.execute(contract_address, queryMessage)
			.then((response) => {
				console.log("created reference nft");
				console.log(reference_nft_token_id, ": ref nft token id");
				router.push(
					`/distribute-nfts?ref_nft=${reference_nft_token_id}&contract_address=${contract_address}`
				);
			});
	};

	const createNfts = async () => {
		const generateMetadata = randomNFTs;
		console.log("genereated metadata: ", generateMetadata);

		const arrayOfTokenUris = generateTokens(generateMetadata);
		console.log("genereated tokens: ", arrayOfTokenUris);

		const queryMessage = {
			batch_mint: {
				tokens: arrayOfTokenUris,
			},
		};

		try {
			console.log(contract_address, ": contract address");
			console.log(queryMessage);

			const createdNfts = await client
				?.execute(contract_address, queryMessage)
				.then(async (res) => {
					setLoading(false);
					console.log("NFTs created successfully", res);
					await createReferenceNft(arrayOfTokenUris);
				})
				.catch((err) => {
					console.error("Error creating NFTs: ", err);
					setLoading(false);
				});
		} catch (error) {
			setLoading(false);
			console.log("failed creating");
			console.error(error);
		}
	};

	return (
		<Button className="w-fit" disabled={isLoading} onClick={() => sell()}>
			Take me to the marketplace
		</Button>
	);
};

export default CreateNftPage;
