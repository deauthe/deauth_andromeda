"use client";
import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import Connected from "./Connected";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import { connectAndromedaClient, useAndromedaStore } from "@/zustand/andromeda";
import { PlusSquareIcon } from "@chakra-ui/icons";

interface ConnectWalletProps {}
const ConnectWallet: FC<ConnectWalletProps> = (props) => {
	const {} = props;
	const { isLoading } = useAndromedaStore();
	const client = useAndromedaClient();
	if (client) {
		return <Connected />;
	}
	return (
		<Button
			className="bg-purple-200"
			onClick={() => {
				connectAndromedaClient();
				console.log("client ", client);
			}}
			disabled={isLoading}
		>
			Connect Wallet
		</Button>
	);
};
export default ConnectWallet;
