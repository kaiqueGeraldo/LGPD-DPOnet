export const salvarToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const obterToken = () => {
  return localStorage.getItem("token");
};

export const removerToken = () => {
  localStorage.removeItem("token");
};
