import { Dropdown } from "@/components/ModalWindow/dropdown";
import CustomModal from "@/components/ModalWindow/modal";
import React from "react";

interface Props {}

const Page = async (props: Props) => {
  const {} = props;
  return (
    <div className="mx-auto mt-20">
      <CustomModal />
      <Dropdown />
    </div>
  );
};

export default Page;
