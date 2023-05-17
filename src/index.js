import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, isSameDomainLink, replaceLinks } from './helpers.js';
import { getAssets, getLinks } from './getAssets.js';
import debug from 'debug';

const pageLoaderDebug = debug('pageLoader');

pageLoaderDebug('booting %o', 'Page loader');

const pageLoader = (url, dir = './output') => {
  console.log('start');
  pageLoaderDebug('Got url %o', url);
  console.log('Got url %o', url);
  let sameDomainLinks;
  pageLoaderDebug('generateFileName %o', generateFileName(url, ''));
  const assetsPath = `${generateFileName(url, '').split('.')[0]}_files`;
  pageLoaderDebug('Downloading assets to folder: %o', assetsPath);
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url, '.html');

      console.log("🚀 ~ file: index.js:24 ~ .then ~ fileName:", fileName);

      pageLoaderDebug('Filename: %o', fileName);
      const filePath = path.join(dir, fileName);
      pageLoaderDebug('Filepath: %o', filePath);
      const links = getLinks(response.data);
      sameDomainLinks = links.filter((link) => isSameDomainLink(link, url));
      const updatedHtml = replaceLinks(sameDomainLinks, response.data, assetsPath, url);
      pageLoaderDebug('Html: %o', updatedHtml);
      return fsp
        .writeFile(filePath, updatedHtml)
        .then(() => filePath)
        .catch((e) => pageLoaderDebug('Can\'t create file: ', e));
    })
    .then(() => {
       getAssets(sameDomainLinks, url, path.join(dir, assetsPath));
    })
    .catch((e) => pageLoaderDebug('Error: ', e));
};

export default pageLoader;

pageLoader('https://ru.hexlet.io/courses', './output');