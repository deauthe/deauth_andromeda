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
import { generateTokens } from "@/helpers/generateTokenUri";

type Props = {};

const CreateNftPage = (props: Props) => {
	const client = useAndromedaClient();
	const { data: code_id } = useGetCodeId("cw721");
	const [contract, setContract] = useState({});

	const [contractAddress, setContractAddress] = useState(
		"andr1uan03c83pvmp90w3xnfh327xfdh5s4x69xxcep9pjxt84v83q64qz99590"
	);

	const instantiate_contract = async () => {
		const config: InstantiateOptions = {
			admin: "andr13g8qm62yu5zhvk4e33zjcs63ne3sv4xt449yl4",
		};
		const cw721_instantiate_message = {
			name: "Example Token",
			symbol: "ET",
			minter: "andr13g8qm62yu5zhvk4e33zjcs63ne3sv4xt449yl4",
			kernel_address:
				"andr14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9shptkql",
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
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Wrapper>
			<div className="mt-20">
				<Button
					className="bg-black text-white px-5 "
					onClick={() => instantiate_contract()}
				>
					instantiate Contract
				</Button>
				<CreateNftButton
					andromeda_client={client}
					contract_address={contractAddress}
				/>

				<NftArea client={client} contract_address={contractAddress} />
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
	const [mainNftTokenId, setMainNftTokenId] = useState<string>("");
	const [image, setImage] = useState("");
	const [nfts, setNfts] = useState([""]);

	useEffect(() => {
		// Get count from localStorage when component mounts
		const tokenId = localStorage.getItem("mainNftTokenId");
		console.log("reached here");
		if (tokenId) {
			console.log("reached here", tokenId);
			setMainNftTokenId(tokenId);
		}
	}, []);

	const queryAllNfts = async () => {
		const queryMessage = {
			all_tokens: {
				limit: 5,
			},
		};
		const imageQuery = {
			all_nft_info: {
				token_id: mainNftTokenId,
				include_expired: false,
			},
		};
		try {
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

			const nfts = await client?.queryContract(contract_address, queryMessage);
			setNfts(nfts);
			console.log(nfts);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="w-full bg-red-400 flex mt-10 h-fit flex-col ">
			<div className="w-fit bg-green-400 mx-auto">
				<Button onClick={queryAllNfts} className="mx-auto ">
					getNfts
				</Button>
			</div>
			<div className="grid grid-cols-4 gap-5 my-10 mx-auto">
				{
					//@ts-ignore
					nfts?.tokens?.length >= 0 &&
						//@ts-ignore
						nfts.tokens.map((item, index) => (
							<div key={index} className="size-44 bg-red-300 rounded-lg">
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
	const sell = async () => {
		setLoading(true);
		createNfts();
	};

	const createNfts = () => {
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

			client?.execute(contract_address, queryMessage).then((res) => {
				setLoading(false);
				console.log("NFTs created successfully", res);
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
