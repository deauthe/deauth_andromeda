"use client";

import Link from "next/link";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { ConnectWallet } from "@/modules/wallet";

interface Category {
	id: number;
	attributes: {
		slug: string;
		name: string;
		products: {
			data: any[]; // Update with the correct type
		};
	};
}

const Navbar = () => {
	return (
		<div
			className={`w-full h-[50px] md:h-[80px]  flex justify-between  z-20 fixed bg-white top-0 transition-all duration-500  px-5    `}
		>
			{/* <div
    className={`bg-red-w-full flex justify-between`}
  > */}
			<div className="flex gap-2 items-center ml-5 ">
				<Link href="/">
					<div className=" flex items-end gap-2 ">
						{/* <img
							src="/logo.png"
							alt="logo"
							className="w-[40px] md:w-[50px] drop-shadow-lg"
						/> */}
						<p className="md:text-3xl text-xl font-light font-heading1">
							Deauth
						</p>
					</div>
				</Link>
			</div>

			<div className="  flex items-center gap-2   ">
				{/* {Button } */}

				<ConnectWallet />

				<div className={`flex    `}>
					<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
						<IoMdHeartEmpty className={`text-[19px] md:text-[24px] `} />
						<div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
							51
						</div>
					</div>

					<Link href="/cart">
						<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
							<BsCart className={`text-[15px] md:text-[20px] fill-black`} />
							{/* TODO */}
							{/* {cartItems.length > 0 && (
								<div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
									{cartItems.length}
								</div>
							)} */}
						</div>
					</Link>
				</div>

				{/* profile  dropdown section  */}

				{/* Icon end */}

				{/* Mobile icon start */}

				{/* Mobile icon end */}
			</div>

			{/* <ToastContainer /> */}
		</div>
	);
};

export default Navbar;
