import { FC } from "react";
import { getRetrospectiveAction } from "../../_actions/get-retrospective";
import { Chart } from "./chart";

type RetrospectiveProps = {
  tenantId: string;
};

export const Retrospective: FC<RetrospectiveProps> = async ({ tenantId }) => {
  const result = await getRetrospectiveAction({
    tenantId,
  });

  if (result.isFailure) {
    return <div>Não foi possível buscar os dados dos últimos 12 meses</div>;
  }

  const { retrospective, growthPercentage } = result.value;

  return <Chart data={retrospective} growthPercentage={growthPercentage} />;
};
