import { FC } from "react";

type YesNoProps = {
  value: boolean;
};

export const YesNo: FC<YesNoProps> = ({ value }) => {
  return <div>{value ? "Sim" : "Não"}</div>;
};
