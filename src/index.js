import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, replaceImageLinks } from './helpers.js';
import { getAssets } from './getAssets.js';
import nock from 'nock';
import axios from 'axios';

const pageLoader = (url, dir = './output') => {
  const assetsPath = `${generateFileName(url, '').split('.')[0]}_files`;
  const host = new URL(url).origin;
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url, '.html');
      const filePath = path.join(dir, fileName);
      return fsp
        .writeFile(filePath, replaceImageLinks(response.data, host, assetsPath))
        .then(() => filePath);
    })
    .then(() => {
      getAssets(url, path.join(dir, assetsPath));
    });
};

export default pageLoader;
