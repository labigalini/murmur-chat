module.exports = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss", // MUST come last
  ],
  importOrder: [
    "^react",
    "^next",
    "^convex|@convex",
    "<THIRD_PARTY_MODULES>",
    "^@/styles/(.*)$",
    "^@/components/(.*)$",
    "^@/convex/(.*)$",
    "^@/hooks/(.*)$",
    "^@/lib/(.*)$",
    "^@/app/(.*)$",
    "^./(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
