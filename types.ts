export type ImgLintRule = {
  test: (file: string) => Promise<void> | void;
  description: string;
};

export type ImgLintConfig = Partial<{
  rules: ImgLintRule[];
  options: Partial<{
    abortEarly?: boolean;
  }>;
}>;
