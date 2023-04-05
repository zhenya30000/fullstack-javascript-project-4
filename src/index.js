import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { cwd } from 'process';
import { generateFileName } from './helpers.js';

const pageLoader = (url, dir = cwd()) => {
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url);
      const filePath = path.resolve(dir, fileName);
      return fsp.writeFile(filePath, response.data)
        .then(() => filePath);
    })
    .catch((error) => console.log(error));
};

export default pageLoader;
