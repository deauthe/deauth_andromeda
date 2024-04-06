"use client";
import CreateNftButton from "@/components/CreateNftButton/CreateNftButton";
import Wrapper from "@/components/Wrappers/Wrapper";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { Button } from "@/components/ui/button";
import { InstantiateOptions } from "@cosmjs/cosmwasm-stargate";
import React, { useState } from "react";
import AndromedaClient from "@andromedaprotocol/andromeda.js";

type Props = {};

const CreateNftPage = (props: Props) => {
	const client = useAndromedaClient();
	const { data: code_id } = useGetCodeId("cw721");
	const [contract, setContract] = useState({});
	const [contactAddress, setContractAddress] = useState(
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

	const MintNft = () => {
		const mintMessage = {
			mint: {
				token_id: "2",
				owner: "andr13g8qm62yu5zhvk4e33zjcs63ne3sv4xt449yl4",
				token_uri:
					"https://beige-royal-slug-524.mypinata.cloud/ipfs/QmdaJhsduJLwroiKCwGmm7SjB6AGnX9mkMdNcjzkH2rhrS",
				extension: {
					publisher: "Andromeda",
				},
			},
		};
		client?.execute(contactAddress, mintMessage);
	};

	const onFileSelect = () => {};
	return (
		<Wrapper>
			<div className="mt-20">
				<Button
					className="bg-black text-white px-5 "
					onClick={() => instantiate_contract()}
				>
					instantiate Contract
				</Button>
				<CreateNftButton />
				<Button
					className="bg-blue-700 text-white px-5 "
					onClick={() => MintNft()}
				>
					mint
				</Button>
				<NftArea client={client} contract_address={contactAddress} />
			</div>
		</Wrapper>
	);
};

const NftArea = ({
	contract_address,
	client,
}: {
	contract_address: string;
	client: AndromedaClient | undefined;
}) => {
	const [nfts, setNfts] = useState([""]);

	const queryAllNfts = async () => {
		const queryMessage = {
			all_tokens: {
				limit: 5,
			},
		};
		try {
			const nfts = await client?.queryContract(contract_address, queryMessage);
			setNfts(nfts);
			console.log(nfts);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Button onClick={queryAllNfts}>getNfts</Button>

			{nfts?.tokens?.length >= 0 &&
				nfts.tokens.map((item, index) => {
					return (
						<div key={index} className="size-44 bg-red-300 rounded-lg">
							adsdaw
						</div>
					);
				})}
		</div>
	);
};

export default CreateNftPage;
