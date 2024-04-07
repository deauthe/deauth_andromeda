"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";

const ShirtSalePage = () => {

    const client = useAndromedaClient();
    const { data: code_id } = useGetCodeId("timelock");
    const [contract, setContract] = useState({});

    const [timeLockContractAddress, setTimeLockContractAddress] = useState(
        ""
    );

    const timelock_instantiate_message = {

        kernel_address: process.env.NEXT_PUBLIC_KERNEL_ADDRESS
    }

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
            }
        } catch (error) {
            console.error(error);
        }

    }



    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Shirt Sale</h1>
            <div className="flex items-center">
                <div className="w-1/2">
                    <img src="hoodie.jpeg" alt="Shirt" className="w-full" />
                </div>
                <div className="w-1/2 pl-8">
                    <h2 className="text-2xl font-bold mb-2">Classic White Shirt</h2>
                    <p className="text-lg font-semibold text-green-600 mb-2">$19.99 <span className="text-gray-500 line-through">$29.99</span></p>
                    <p className="text-lg text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus ipsum vitae velit porta, nec finibus lorem hendrerit.</p>
                    <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => create_timelock()}>Buy Hoodie</Button>
                </div>
            </div>
        </div>
    );
};

export default ShirtSalePage;
