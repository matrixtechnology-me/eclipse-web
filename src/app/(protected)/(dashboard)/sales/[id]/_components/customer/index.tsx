import { FC } from "react";
import { Name } from "./name";
import { PhoneNumber } from "./phone-number";

type CustomerProps = {
  name: string;
  phoneNumber: string;
};

export const Customer: FC<CustomerProps> = ({ name, phoneNumber }) => {
  return (
    <div className="w-full flex flex-col pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Cliente</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Name value={name} />
        <PhoneNumber value={phoneNumber} />
      </div>
    </div>
  );
};
