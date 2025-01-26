export type ImgLintRule = {
  test: (file: string) => Promise<void> | void;
  name: string;
  description: string;
};

export type ImgLintConfig = Partial<{
  files: string | string[];
  rules: ImgLintRule[];
  options: Partial<{
    abortEarly?: boolean;
  }>;
}>;

export type ImgLintResult = {
  rule: ImgLintRule;
  error?: Error;
};

export type ImgLintOutput = Array<{
  file: string;
  results: ImgLintResult[];
}>;
