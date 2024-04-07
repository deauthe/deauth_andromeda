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


    const get_child_nft_owner_data = async () => {
        const queryMessage = {
            "nft_info": {
                "token_id": "1"
            }
        }


        try {

            const refNft = await client
                ?.queryContract(contract_address, queryMessage)
                .then((res) => {
                    instantiate_contract(res)
                });
        } catch (error) {
            console.error(error);
        }


    }

    const instantiate_contract = async () => {
        /* here we have hard coded the address and just shown a possible implementation of the concept as getting the owner's after querying reference nft , was not possible as we were unable to execute multiple queries at a single time 
        
        After getting the reference nft we would first find the parent nft (as we have it stored in local storage) and then calculate the proportion of each owner as many no. of times they appear
        
        */
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