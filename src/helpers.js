export const generateFileName = (url, fileType) => {
  const name = new URL(url);
  return (
    name
      .toString()
      .replace(name.protocol + '//', '')
      .replace(fileType, '')
      .replace(/[^a-zA-Z0-9]/g, '-') + fileType
  );
};

export const isSameDomainLink = (url, baseUrl) => {
  const link = new URL(url, baseUrl);
  if (
    link.hostname === new URL(baseUrl).hostname ||
    link.toString().startsWith('/')
  ) {
    return true;
  } else {
    return false;
  }
};

export const getFullLink = (relativeUrl, baseUrl) => {
  const base = new URL(baseUrl);
  const url = new URL(relativeUrl, base);
  return url.toString();
};

export const replaceLinks = (links, html, assetsPath, baseUrl) => {
  let result = html;
  let fileType;
  links.forEach((link) => {
    link.split('.').length > 1 ? fileType = '.' + link.split('.').at(-1) : fileType = '.html';
    const fullLink = getFullLink(link, baseUrl);
    const fileName = generateFileName(fullLink, fileType, baseUrl);
    return (result = result
      .replace(link, `${assetsPath}/${fileName}`)
      .replace(' />', '>'));
  });
  return result;
};
