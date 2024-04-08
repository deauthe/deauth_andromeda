"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";

const ShirtSalePage = () => {
	const client = useAndromedaClient();
	const { data: code_id } = useGetCodeId("timelock");
	const [contract, setContract] = useState({});
	const [splitterAddr, setSplitterAddr] = useState("");
	const [timeLockContractAddress, setTimeLockContractAddress] = useState("");

	useEffect(() => {
		let SAddr = localStorage.getItem("splitter_address") || "";
		setSplitterAddr(SAddr);
	}, []);

	console.log("splitterAddr", splitterAddr);

	const timelock_instantiate_message = {
		kernel_address: process.env.NEXT_PUBLIC_KERNEL_ADDRESS,
	};

	const timelock_distribute_funds = {
		hold_funds: {
			recipient: {
				address:
					"andr1pt8zn23ch0fr888w6aa02crtgglvu90hzdaw8waskjm97ma97fdscnzt3n",
				msg: "eyJzZW5kIjp7fX0=",
			},
			condition: {
				expiration: 1712687400000,
			},
		},
	};

	interface Coin {
		denom: string;
		amount: string;
	}

	const coin: Coin = {
		denom: "uandr",
		amount: "1000",
	};

	const create_timelock = async () => {
		try {
			const contract = await client?.instantiate(
				code_id!,
				timelock_instantiate_message,
				"creating time lock"
			);
			console.log("contract timelock done", contract);
			if (contract) {
				setContract(contract);
				setTimeLockContractAddress(contract?.contractAddress);
				console.log(timeLockContractAddress);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const distribute_funds_to_splitter = async () => {
		try {
			const contract = await client?.execute(
				timeLockContractAddress,
				timelock_distribute_funds,
				undefined,
				undefined,
				[coin]
			);
			console.log("contract timelock hold funds done", contract);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-4">Shirt Sale</h1>
			<div className="flex items-center">
				<div className="w-1/2">
					<img src="hoodie.jpeg" alt="Shirt" className="w-full" />
				</div>
				<div className="w-1/2 pl-8">
					<h2 className="text-2xl font-bold mb-2">Classic White Shirt</h2>
					<p className="text-lg font-semibold text-green-600 mb-2">
						$19.99 <span className="text-gray-500 line-through">$29.99</span>
					</p>
					<p className="text-lg text-gray-700 mb-4">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus
						ipsum vitae velit porta, nec finibus lorem hendrerit.
					</p>
					<Button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={() => create_timelock()}
					>
						Buy Hoodie
					</Button>
					<Button
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
						onClick={() => distribute_funds_to_splitter()}
					>
						Confirm
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ShirtSalePage;
