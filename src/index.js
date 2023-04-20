import fsp from 'fs/promises';
import getPage from './getPage.js';
import path from 'path';
import { generateFileName, isSameDomainLink, replaceLinks } from './helpers.js';
import { getAssets, getLinks } from './getAssets.js';
import nock from 'nock';
import axios from 'axios';

/* nock.disableNetConnect();

const responseBefore = await fsp.readFile(
  path.join('.', '__fixtures__', 'resBefore'),
  'utf-8'
);

nock('https://ru.hexlet.io')
  .get('/courses')
  .reply(200, responseBefore); */

const pageLoader = (url, dir = './output') => {
  let sameDomainLinks;
  const assetsPath = `${generateFileName(url, '').split('.')[0]}_files`;
  return getPage(url)
    .then((response) => {
      const fileName = generateFileName(url, '.html');
      const filePath = path.join(dir, fileName);
      const links = getLinks(response.data);
      sameDomainLinks = links.filter((link) => isSameDomainLink(link, url));
      const updatedHtml = replaceLinks(sameDomainLinks, response.data, assetsPath, url);
      return fsp
        .writeFile(filePath, updatedHtml)
        .then(() => filePath);
    })
    .then(() => {
       getAssets(sameDomainLinks, url, path.join(dir, assetsPath));
    });
};

export default pageLoader;

/* pageLoader('http://localhost:8081', './output'); */