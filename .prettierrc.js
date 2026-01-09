module.exports = {
  plugins: ["prettier-plugin-sql"],
  overrides: [
    {
      files: "*.sql",
      options: { parser: "sql" },
    },
  ],
};
