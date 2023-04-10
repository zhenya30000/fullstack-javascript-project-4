import path from 'path';

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

export const replaceImageLinks = (htmlString, host, newPath) => {
  const imgRegExp = /<img [^>]+>/g;
  const srcRegExp = /src=['"]([^'"]+)['"]/;

  let resultHtml = htmlString;
  const imgTags = resultHtml.match(imgRegExp);
  let newHtml;

  if (imgTags) {
    imgTags.forEach((tag) => {
      const srcAttrMatch = tag.match(srcRegExp);
      if (srcAttrMatch) {
        let oldSrc = `${host}${srcAttrMatch[1]}`;
        const fileType = `.${oldSrc.split('.').at(-1)}`;
        const newName = generateFileName(oldSrc, fileType);
        newHtml = resultHtml.replace(
          srcAttrMatch[1],
          path.join(newPath, newName)
        );
      }
    });
  }
  return newHtml;
};
