const borrowKeys = {
  lists: ["borrows", "list"],
  list: (filter) => ["borrows", "list", { ...filter }],
  detail: (slug) => ["borrows", "detail", slug],
};

export default borrowKeys;
