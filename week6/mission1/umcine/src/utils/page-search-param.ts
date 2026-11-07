export function parsePageSearchParam(
  value: unknown
): number | undefined {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const page = Number(value);

  if (!Number.isInteger(page) || page < 1 || page > 1000) {
    return undefined;
  }

  return page === 1 ? undefined : page;
}
