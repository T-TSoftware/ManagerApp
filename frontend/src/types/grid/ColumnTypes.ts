export const ColumnTypes = {
  numberColumn: {
    type: "rightAligned",
    valueFormatter: (params: any) =>
      params.value == null ? "" : Number(params.value).toLocaleString("tr-TR"),
    valueParser: (params: any) =>
      params.newValue
        ? Number(
            params.newValue.toString().replace(/\./g, "").replace(",", ".")
          )
        : null,
    cellClass: "text-right",
  },
  dateColumn: {
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleDateString("tr-TR") : "",
    cellClass: "text-center",
  },
  dateTimeColumn: {
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleString("tr-TR") : "",
    cellClass: "text-center",
  },
  percentageColumn: {
    valueFormatter: (params: any) =>
      params.value == null ? "" : `${params.value.toFixed(2)}%`,
    cellClass: "text-right",
  },
};
