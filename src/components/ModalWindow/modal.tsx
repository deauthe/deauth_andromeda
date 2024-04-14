"use client";

import { useState } from "react";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

function CustomModalContent() {
	const [quantity, setQuantity] = useState(1);

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prevQuantity) => prevQuantity - 1);
		}
	};

	const increaseQuantity = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	return (
		<Dialog>
			<DialogTrigger>
				<div className=" flex justify-center ">
					<Button
						className=" border-2 border-red-400 rounded-none bg-transparent text-white hover:bg-red-400 hover:text-white"
						// onClick={() => {
						//   buyNft(item);
						// }}
					>
						Buy Your NFT
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md border-2 border-red-400 bg-transparent rounded-none text-red-400">
				<DialogHeader></DialogHeader>

				<div className="flex justify-evenly items-center">
					<div className="mr-4">
						<Image
							src={"/cart-nft.png"}
							alt="image"
							width={150}
							height={150}
							sizes="full"
						/>
					</div>

					<div className="flex flex-col gap-4 justify-center items-center">
						<div>
							<p className="text-red-400 font-bold">Cease Your ownership</p>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={decreaseQuantity}
								className="py-1 border-2 border-red-400 text-white text-2xl hover:bg-red-300 hover:text-black px-2.5"
							>
								-
							</button>
							<span className="mx-3 text-red-400 text-3xl font-bold">
								{quantity}
							</span>
							<button
								onClick={increaseQuantity}
								className="px-2 py-1 border-2 border-red-400 text-white text-2xl hover:bg-red-300 hover:text-black"
							>
								+
							</button>
						</div>
					</div>
				</div>

				<div className="flex justify-end mt-4 ">
					<button className="border-2 border-red-400 p-1 text-white font-bold px-4 hover:bg-red-300 hover:text-black ">
						Buy All
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default CustomModalContent;
