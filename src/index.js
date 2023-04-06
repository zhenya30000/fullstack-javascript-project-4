import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, replaceImageLinks } from './helpers.js';
import { getResources } from './getResources.js';

const pageLoader = (url, dir) => {
  const resourcesPath = `${generateFileName(url).split('.')[0]}_files`;
  console.log(resourcesPath);
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url);
      const filePath = path.resolve(dir, fileName);
      return fsp.writeFile(filePath, replaceImageLinks(response.data, resourcesPath)).then(() => filePath);
    })
    .then(() => {
      getResources(url, path.join(dir, resourcesPath));
    })
    .catch((error) => console.log(error));
};

export default pageLoader;
