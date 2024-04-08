"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCart } from "react-icons/bs";

export function Dropdown() {
  const [position, setPosition] = React.useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-transparent rounded-none border-none text-red-400 text-2xl hover:bg-transparent hover:text-red-400 mt-1">
        <Button variant="outline">
          <BsCart />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-transparent border-2 border-red-400 mt-4 mr-4">
        <DropdownMenuLabel className="text-red-400 text-center">Add NFTs to Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4">
          {/* Cart item 1 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img src="/cart-nft.png" alt="Item 1" className="w-16 h-16 rounded-md" />
              <div>
                <p className="text-red-400 font-semibold">Shad</p>
                <p className="text-red-300">Desgin NFT</p>
              </div>
            </div>
            <p className="text-red-400 font-semibold">$10</p>
          </div>
          {/* Cart item 2 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img src="/cart-nft.png" alt="Item 2" className="w-16 h-16 rounded-md" />
              <div>
                <p className="text-red-400 font-semibold">Vape</p>
                <p className="text-red-300">Design NFT</p>
              </div>
            </div>
            <p className="text-red-400 font-semibold">$15</p>
          </div>
          {/* Total */}
          <div className="flex justify-between border-t pt-4">
            <p className="font-semibold">Total</p>
            <p className="text-red-400 font-semibold">$25</p>
          </div>

          <div className="flex justify-center mt-4 ">
          <button className="border-2 border-red-400 p-1 text-white font-bold px-4 hover:bg-red-300 hover:text-black ">
            Add To Cart
          </button>
        </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
