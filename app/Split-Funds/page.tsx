"use client";
import CreateNftButton from "@/components/CreateNftButton/CreateNftButton";
import Wrapper from "@/components/Wrappers/Wrapper";
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient";
import useGetCodeId from "@/lib/andrjs/hooks/useGetCodeId";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";


type Props = {};

const CreateSplitterPage = (props: Props) => {
    const client = useAndromedaClient();
    const { data: code_id } = useGetCodeId("splitter");
    const [contract, setContract] = useState({});

    const [contractAddress, setContractAddress] = useState(
        "andr12y9cleh5069cjt593apttq2qd77m6ak3ddp9cj3f55lmrl2mrajs63n9l3"
    );

    const instantiate_contract = async () => {


        const splitter_instantiate_message =
        {
            recipients: [
                {
                    "recipient": {
                        "address": "andr12yss47wjjqufx9jle8mjscal3jravrejns5kml"
                    },
                    "percent": "0.4"
                },
                {
                    "recipient": {
                        "address": "andr15gle6ufez8p68atac994mff0umxj22ctth4482"
                    },
                    "percent": "0.3"
                },
                {
                    "recipient": {
                        "address": "andr1tl2eg6g5nut48x6nxu7js23zdau40ta3txzlh9"
                    },
                    "percent": "0.15"
                },
                {
                    "recipient": {
                        "address": "andr1mykdlv85nkrp9a5dqz35hre63edsauhndcj73q"
                    },
                    "percent": "0.15"
                },

            ],
            kernel_address: "andr14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9shptkql",
            owner: "andr13g8qm62yu5zhvk4e33zjcs63ne3sv4xt449yl4",
        }

        try {
            const contract = await client?.instantiate(
                code_id!,
                splitter_instantiate_message,
                "sending funds to owners"
            );
            console.log("contract splitter done", contract);
            if (contract) {
                setContract(contract);
                setContractAddress(contract?.contractAddress);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Wrapper>
            <div className="mt-20">
                <Button
                    className="bg-black text-white px-5 "
                    onClick={() => instantiate_contract()}
                >
                    Create Splitter
                </Button>
                <CreateNftButton
                    andromeda_client={client}
                    contract_address={contractAddress}
                />


            </div>
        </Wrapper>
    );
};


export default CreateSplitterPage;