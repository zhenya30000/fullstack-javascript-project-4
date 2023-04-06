export const generateFileName = (address) => {
  const name = new URL(address);
  return (
    name
      .toString()
      .replace(name.protocol + '//', '')
      .replace(/[^a-zA-Z0-9]/g, '-') + '.html'
  );
};

export const replaceImageLinks = (html, resourcesPath) => {
  console.log(resourcesPath);
  return html
    .toString()
    .replace(/<img.*?src="(.+?)"/gi, (match, src) => {
      const regex = /\/([^/]+)$/; // регулярное выражение для выбора имени файла с расширением
      const filenameMatch = regex.exec(src);
      if (filenameMatch) {
        const filename = filenameMatch[1];
        return `<img src="${resourcesPath}/${filename}"`;
      }
      return match; // если имя файла не найдено, вернем исходное совпадение
    });
  }