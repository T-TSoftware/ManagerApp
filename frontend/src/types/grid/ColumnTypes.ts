export const ColumnTypes = {
  numberColumn: {
    valueFormatter: (params: any) =>
      params.value == null ? "" : Number(params.value).toLocaleString("tr-TR"),
    valueParser: (params: any) =>
      params.newValue
        ? Number(
            params.newValue.toString().replace(/\./g, "").replace(",", ".")
          )
        : null,
    cellClass: "text-right",
    filter: "agNumberColumnFilter",
    editable: true,
  },

  dateColumn: {
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleDateString("tr-TR") : "",
    cellClass: "text-center",
    filter: "agDateColumnFilter",
  },

  dateTimeColumn: {
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleString("tr-TR") : "",
    cellClass: "text-center",
    filter: "agDateColumnFilter",
  },

  percentageColumn: {
    valueFormatter: (params: any) =>
      params.value == null ? "" : `${params.value.toFixed(2)}%`,
    cellClass: "text-right",
    filter: "agNumberColumnFilter",
  },
};
