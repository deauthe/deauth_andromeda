import { NFT_metadata } from "./staticRandomNfts";
import { v4 as uuidv4, V4Options } from "uuid";

type TokenData = {
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
		const owner_of_minted_nft = "andr13g8qm62yu5zhvk4e33zjcs63ne3sv4xt449yl4";
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
