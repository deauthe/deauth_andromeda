import { NFT_metadata } from "./staticRandomNfts";
import { v4 as uuidv4, V4Options } from "uuid";

export type TokenData = {
	token_id: string;
	owner: string;
	token_uri: string;
	extension: {
		publisher: string;
	};
};

export const generateTokens = (
	generated_metadata: NFT_metadata[]
): TokenData[] => {
	const tokens: TokenData[] = generated_metadata.map((item, index) => {
		const token_id = uuidv4();
		const owner_of_minted_nft = process.env
			.NEXT_PUBLIC_CONTRACT_OWNER as string;
		return {
			token_id,
			owner: owner_of_minted_nft,
			token_uri: JSON.stringify(item),
			extension: {
				publisher: "",
			},
		};
	});
	return tokens;
};
