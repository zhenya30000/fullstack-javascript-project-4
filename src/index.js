import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { cwd } from 'process';
import { generateFileName } from './helpers.js';

const resolvePath = (filePath) => path.resolve(cwd(filePath), filePath);

export default (url) => {
  getPage(url)
    .then((response) => fsp.writeFile(resolvePath(generateFileName(url)), response.data))
    .catch((error) => console.log(error));
};
