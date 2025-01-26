import { metadata, dimensions } from "imglint";

export default {
  files: "./images/**/*.jpg",
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
