import { ConnectWallet } from "@/modules/wallet";
import { Center, Image, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Wrapper from "@/components/Wrappers/Wrapper";
import HeroBanner from "@/components/Hero/Hero";

interface Props {}

const Page = async (props: Props) => {
	const {} = props;
	return (
		<div className="mx-auto mt-20">
			<HeroBanner />
		</div>
	);
};

export default Page;
