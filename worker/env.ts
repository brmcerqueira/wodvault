export interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  IMGBB_API_KEY: string;
}
