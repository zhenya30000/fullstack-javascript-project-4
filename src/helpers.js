export const generateFileName = (address) => {
  const name = new URL(address);
  return name.toString().replace(name.protocol + '//', '').replace(/[^a-zA-Z0-9]/g, '-') + '.html';
};
