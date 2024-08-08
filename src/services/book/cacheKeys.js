const bookKeys = {
  lists: ["books", "list"],
  list: (filter) => ["books", "list", { ...filter }],
  detail: (slug) => ["books", "detail", slug],
};

export default bookKeys;
