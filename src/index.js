import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, replaceImageLinks } from './helpers.js';
import { getAssets } from './getAssets.js';

const pageLoader = (url, dir) => {
  const resourcesPath = `${generateFileName(url, '').split('.')[0]}_files`;
  const host = new URL(url).host;
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url, '.html');
      const filePath = path.join(dir, fileName);
      return fsp
        .writeFile(filePath, replaceImageLinks(response.data, host, resourcesPath))
        .then(() => filePath);
    })
    .then(() => {
      getAssets(url, path.join(dir, resourcesPath));
    });
};

export default pageLoader;
