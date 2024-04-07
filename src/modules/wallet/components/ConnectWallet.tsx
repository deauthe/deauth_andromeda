"use client";
import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import Connected from "./Connected";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import { connectAndromedaClient, useAndromedaStore } from "@/zustand/andromeda";
import { PlusSquareIcon } from "@chakra-ui/icons";
import LoaderImage from '../../../../assets/loader.gif';
import Image from "next/image";
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
			className="bg-[#cb4346]"
			onClick={() => {
				connectAndromedaClient();
				console.log("client ", client);
			}}
			disabled={isLoading}
		>
			
			{
				isLoading ? (
					// <p>Connecting....</p>
				<Image src={"/loader.gif"} alt="gif" width={100} height={100}/>
				):(
					<p>Connect Wallet</p>
				)
			}


			
		</Button>
	);
};
export default ConnectWallet;
