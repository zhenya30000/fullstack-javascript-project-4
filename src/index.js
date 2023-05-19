import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, isSameDomainLink, replaceLinks } from './helpers.js';
import { getAssets, getLinks } from './getAssets.js';
import debug from 'debug';

const pageLoaderDebug = debug('pageLoader');
const logError = debug('pageLoader:error');

pageLoaderDebug('booting %o', 'Page loader');

const pageLoader = (url, dir = './output') => {
  pageLoaderDebug('Got url %o', url);
  let sameDomainLinks;
  const assetsPath = `${generateFileName(url, '').split('.')[0]}_files`;
  pageLoaderDebug('Downloading assets to folder: %o', assetsPath);
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url, '.html');
      const filePath = path.join(dir, fileName);
      const links = getLinks(response.data, url);
      sameDomainLinks = links.filter((link) => isSameDomainLink(link, url));
      const updatedHtml = replaceLinks(sameDomainLinks, response.data, assetsPath, url);
      return fsp
        .writeFile(filePath, updatedHtml)
        .then(() => filePath)
        .catch((e) => logError('Can\'t create file: ', e));
    })
    .then(() => {
       getAssets(sameDomainLinks, url, path.join(dir, assetsPath));
    })
    .catch((e) => logError('Error: ', e));
};

export default pageLoader;

/* pageLoader('https://ru.hexlet.io/courses', './output'); */