"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const DistributeNfts = (props: Props) => {
	const [allNfts, setAllNfts] = useState<any>([]);

	const router = useRouter();
	const queryParams = useSearchParams();
	const refNftTokenId: string | null = queryParams.get("ref_nft");
	return <div>page</div>;
};

export default DistributeNfts;
