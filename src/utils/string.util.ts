export const cleanSymbols = (str: string) => {
  return str.replace(/^[^a-zA-Z0-9]+/, '');
};

export const cleanHref = (href: string) => {
  return href.replace(/[^a-zA-Z0-9/-]+/g, '');
};
