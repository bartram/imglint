import { metadata } from "@imglint/metadata";
import { dimensions } from "@imglint/dimensions";

export default {
  rules: [
    metadata({
      key: "Marked",
      value: {
        equals: true,
      },
    }),
    dimensions({ max: { width: 3000 } }),
  ],
};
