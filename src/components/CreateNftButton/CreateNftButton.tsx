"use client";
import { useState } from "react";
import { v4 as uuidv4, V4Options } from "uuid";
import { Row, Form } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import { Button } from "@/components/ui/button";
import Wrapper from "../Wrappers/Wrapper";
import AndromedaClient from "@andromedaprotocol/andromeda.js";
import { NFT_metadata } from "@/helpers/staticRandomNfts";
// const client = ipfsHttpClient('https://uniqo.infura-ipfs.io')
const projectId = "2ONjCGu7UlrPOzmZ3hqy8WlN2GC";
const projectSecretKey = "43cc6a424bd74fd70d8a175972fbba87";

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
	"base64"
)}`;

console.log(auth);
const subdomain = "https://uniqo-marketplace.infura-ipfs.io";

console.log(subdomain);
const client = ipfsHttpClient({
	host: "infura-ipfs.io",
	port: 5001,
	protocol: "https",
	headers: {
		authorization: auth,
	},
});

const CreateNftButton = ({
	andromeda_client,
	contract_address,
}: {
	andromeda_client: AndromedaClient | undefined;
	contract_address: string;
}) => {
	// console.log(marketplace,nft,"this is food");

	const [image, setImage] = useState("");
	const [price, setPrice] = useState(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");



	
	//@ts-ignore
	const uploadToIPFS = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (typeof file !== "undefined") {
			try {
				const result = await client.add(file);
				console.log("this is result", result);
				setImage(`${subdomain}/ipfs/${result.path}`);
				console.log("image", image);
				console.log(`${subdomain}/ipfs/${result.path}`);
			} catch (error) {
				console.log("ipfs image upload error: ", error);
			}
		}
	};
	const createNFT = async () => {
		if (!image || !name || !description) {
			console.log(
				"please fill fields:",
				image,
				"name:",
				name,
				"description:",
				description
			);
			return;
		}
		try {
			const token_id = uuidv4();
			const owner_of_minted_nft: string =
				process.env.NEXT_PUBLIC_CONTRACT_OWNER!; //remove static but it only works if you are the owner of the contract
			const token_uri: NFT_metadata = {
				name: "Token1",
				description: "This is a description",
				image: image,
			};

			mintNft(token_id, owner_of_minted_nft, JSON.stringify(token_uri));
		} catch (error) {
			console.log("ipfs uri upload error: ", error);
		}
	};

	const getDesignerDetails = async () => {
		try {
		  const response = await fetch("/api/getDesignerDetails", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ walletAddr }),
		  });
	
		  if (!response.ok) {
			throw new Error("Failed to fetch designer details");
		  }
	
		  const data = await response.json();
		  const { cw721_addr, associated_marketplace_addr } = data;
		  setCw721Addr(cw721_addr);
		  setMarketplaceAddr(associated_marketplace_addr);
		} catch (error) {
		  console.error("Error:", error);
		}
	  };

	const mintNft = (token_id: string, owner: string, token_uri: string) => {
		console.log(
			"this is my contract and my token Id: ",
			contract_address,
			token_id
		);
		const mintMessage = {
			mint: {
				token_id,
				owner,
				token_uri,
				extension: {
					publisher: "Andromeda",
				},
			},
		};
		andromeda_client?.execute(contract_address, mintMessage);
		localStorage.setItem("mainNftTokenId", token_id);
	};
	return (
		<Wrapper>
			<div className="content mx-auto flex flex-col gap-10 px-20 w-1/2 border-2 border-red-400 p-3 py-8  shadow-lg mt-[12em]">
				<Form.Control
					type="file"
					required
					name="file"
					onChange={uploadToIPFS}
					className=" border-red-400 border-2 bg-transparent text p-2  outline-none"
				/>
				<Form.Control
					onChange={(e) => setName(e.target.value)}
					size="lg"
					required
					type="text"
					placeholder="Name"
					className=" border-red-400 border-2 bg-transparent text p-2  outline-none text-red-400"
				/>
				<Form.Control
					onChange={(e) => setDescription(e.target.value)}
					size="lg"
					required
					as="textarea"
					placeholder="Description"
					className=" border-red-400 border-2 bg-transparent p-2  outline-none text-red-400"
				/>

				<div className="d-grid px-0 m-auto bg-red-400">
					<Button onClick={createNFT} size="lg" className="bg-red-400">
						Create & List NFT!
					</Button>
				</div>
			</div>
		</Wrapper>
	);
};

export default CreateNftButton;
