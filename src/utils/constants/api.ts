export const API_SERVICES = ["genomicsservice"] as const;

export type ApiService = (typeof API_SERVICES)[number];

export type ApiServiceEnv = {
  public: string;
  internal: string;
};

export const API_SERVICE_ENVS: Record<ApiService, ApiServiceEnv> = {
  genomicsservice: {
    public: "PUBLIC_API_GENOMICS_SERVICE",
    internal: "INTERNAL_API_GENOMICS_SERVICE",
  },
};
