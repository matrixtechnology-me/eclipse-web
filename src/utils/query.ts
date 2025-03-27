export const generateQueryParams = (
  queryParams: Record<string, string | undefined>
) => {
  const queryParamsStringBuilder: string[] = ["?"];

  let isSomeValid = false;
  let hasSomeBefore = false;

  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      if (!isSomeValid) isSomeValid = true;

      if (hasSomeBefore) {
        queryParamsStringBuilder.push("&");
      } else {
        hasSomeBefore = true;
      }

      queryParamsStringBuilder.push(`${key}=${value}`);
    }
  }

  return isSomeValid ? queryParamsStringBuilder.join("") : "";
};

export const generateSearchParams = generateQueryParams;
