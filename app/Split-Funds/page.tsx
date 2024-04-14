"use client";
import CreateNftButton from "@/components/CreateNftButton/CreateNftButton";
import Wrapper from "@/components/Wrappers/Wrapper";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const CreateSplitterPage = (props: Props) => {
	const client = useAndromedaClient();
	const { data: code_id } = useGetCodeId("splitter");
	const [splitterContract, setSplitterContract] = useState({});
	const [refresh, setRefresh] = useState(false);
	const [refNftId, setRefNftId] = useState("");
	const [cw721_address, setCw721Adress] = useState("");
	const router = useRouter();

	useEffect(() => {
		setRefNftId(localStorage.getItem("ref_nft") as string);
		setCw721Adress(localStorage.getItem("cw721_address") as string);
		setRefresh(false);
	}, [refresh]);

	const get_child_nft_owner_data = async () => {
		const queryMessage = {
			nft_info: {
				token_id: "1",
			},
		};

		try {
			const refNft = await client
				?.queryContract(cw721_address, queryMessage)
				.then((res) => {
					instantiate_splitter_contract();
				});
		} catch (error) {
			console.error(error);
		}
	};

	const instantiate_splitter_contract = async () => {
		/* here we have hard coded the address and just shown a possible implementation of the concept as getting the owner's after querying reference nft , was not possible as we were unable to execute multiple queries at a single time 
	    
		After getting the reference nft we would first find the parent nft (as we have it stored in local storage) and then calculate the proportion of each owner as many no. of times they appear
	    
		*/
		const splitter_instantiate_message = {
			recipients: [
				{
					recipient: {
						address: "andr12yss47wjjqufx9jle8mjscal3jravrejns5kml",
					},
					percent: "0.4",
				},
				{
					recipient: {
						address: "andr15gle6ufez8p68atac994mff0umxj22ctth4482",
					},
					percent: "0.3",
				},
				{
					recipient: {
						address: "andr1tl2eg6g5nut48x6nxu7js23zdau40ta3txzlh9",
					},
					percent: "0.15",
				},
				{
					recipient: {
						address: "andr1mykdlv85nkrp9a5dqz35hre63edsauhndcj73q",
					},
					percent: "0.15",
				},
			],
			kernel_address: process.env.NEXT_PUBLIC_KERNEL_ADDRESS,
			owner: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
		};

		try {
			const splitterContract = await client?.instantiate(
				code_id!,
				splitter_instantiate_message,
				"sending funds to owners"
			);

			console.log("splitterContract splitter done", splitterContract);
			if (splitterContract) {
				setSplitterContract(splitterContract?.contractAddress);
				localStorage.setItem(
					"splitter_address",
					splitterContract?.contractAddress
				);
				router.push("/spend-timelock-funds");
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
					onClick={() => instantiate_splitter_contract()}
				>
					Create Splitter
				</Button>
			</div>
		</Wrapper>
	);
};

export default CreateSplitterPage;
