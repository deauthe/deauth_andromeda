"use client";
import { useState } from "react";
import { Row, Form } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import { Button } from "@/components/ui/button";
import Wrapper from "../Wrappers/Wrapper";
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

const Create = () => {
	// console.log(marketplace,nft,"this is food");
	const [image, setImage] = useState("");
	const [price, setPrice] = useState(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const uploadToIPFS = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (typeof file !== "undefined") {
			try {
				const result = await client.add(file);
				console.log("this is result", result);
				setImage(`${subdomain}/ipfs/${result.path}`);
			} catch (error) {
				console.log("ipfs image upload error: ", error);
			}
		}
	};
	const createNFT = async () => {
		if (!image || !price || !name || !description) return;
		try {
		} catch (error) {
			console.log("ipfs uri upload error: ", error);
		}
	};
	const mintThenList = async (result: any) => {};
	return (
		<Wrapper>
			<div className="px-44  mt-5">
				<div className="row">
					<main
						role="main"
						className="col-lg-12 mx-auto"
						style={{ maxWidth: "1000px" }}
					>
						<div className="content mx-auto ">
							<Row className="gap-4">
								<Form.Control
									className="bg-red-400"
									type="file"
									required
									name="file"
									onChange={uploadToIPFS}
								/>
								<Form.Control
									onChange={(e) => setName(e.target.value)}
									size="lg"
									required
									type="text"
									placeholder="Name"
								/>
								<Form.Control
									onChange={(e) => setDescription(e.target.value)}
									size="lg"
									required
									as="textarea"
									placeholder="Description"
								/>
								<Form.Control
									onChange={(e) => setPrice(e.target.value)}
									size="lg"
									required
									type="number"
									placeholder="Price in ANDR"
								/>
								<div className="d-grid px-0">
									<Button onClick={createNFT} size="lg">
										Create & List NFT!
									</Button>
								</div>
							</Row>
						</div>
					</main>
				</div>
			</div>
		</Wrapper>
	);
};

export default Create;
