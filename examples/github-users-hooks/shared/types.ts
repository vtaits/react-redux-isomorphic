export type LoadParams = {
  setTitle: (title: string) => void;

  setStatus: (title: number) => void;

  fetch: (url: string) => Promise<{
    status: number;
    json: () => Promise<any>;
  }>
};

export type User = {
  id: number;
  score: number;
  login: string;
  name: string;
};

export type ErrorResponse = {
  message: string;
};
