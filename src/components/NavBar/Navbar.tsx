"use client";

import Link from "next/link";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { ConnectWallet } from "@/modules/wallet";
import Image from "next/image";
import { Dropdown } from "../ModalWindow/dropdown";
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
      className={`w-full h-[50px] md:h-[80px]  flex justify-between  z-20 fixed bg-black  shadow-lg top-0 transition-all duration-500  px-5    `}
    >
      {/* <div
    className={`bg-red-w-full flex justify-between`}
  > */}
      <div className="flex gap-2 items-center ml-5 ">
        <Link className="h-fit" href="/">
          <div className=" flex items-end gap-2  h-fit">
            <Image
              src={"/NavLogo.png"}
              alt="logo"
              width={90}
              height={90}
              className=""
            />
          </div>
        </Link>
      </div>

      <div className="  flex items-center gap-2   ">
        {/* {Button } */}

        <ConnectWallet />

        <div className={`flex    `}>
          <div className="w-8 text-white md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
            <IoMdHeartEmpty className={`text-[19px] md:text-[24px] `} />
            <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
              51
            </div>
          </div>

          {/* <Link href="/cart">
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
              <BsCart className={`text-[15px] text-white md:text-[20px]`} />
              
            </div>
          </Link> */}
          <Dropdown/>
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
