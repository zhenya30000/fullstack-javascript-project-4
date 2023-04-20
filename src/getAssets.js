import * as cheerio from 'cheerio';
import fs from 'fs';
import fsp from 'fs/promises';
import axios from 'axios';
/* import httpAdapter from 'axios/lib/adapters/http.js' */
import path from 'path';
import { generateFileName, getFullLink, isSameDomainLink } from './helpers.js';

/* axios.defaults.adapter = httpAdapter; */

export const getLinks = (html) => {
  const $ = cheerio.load(html);
  const tags = $('link[href], img[src], script');
  const links = [];
  tags.each((_, tag) => {
    const src = $(tag).attr('src') || $(tag).attr('href');
    links.push(src);
  });

  return links;
};

const downloadAssets = (links, host, filePath) => {
  let fileType;
  Promise.all(
    links.map((linkUrl) => {
      const fullLink = getFullLink(linkUrl, host);
      linkUrl.split('.').length > 1
        ? (fileType = '.' + linkUrl.split('.').at(-1))
        : (fileType = '.html');
      const fileName = generateFileName(fullLink, fileType);
      axios.get(fullLink, { responseType: 'stream' }).then((response) => {
        response.data.pipe(fs.createWriteStream(path.join(filePath, fileName)));
      });
    })
  ).catch((e) => console.error('Download error:', e));
};

export const getAssets = (links, url, assetsPath) => {
  fsp
    .mkdir(assetsPath)
    .then(() => {
      downloadAssets(links, url, assetsPath);
    })
    .catch(() => {
      downloadAssets(links, url, assetsPath);
    });
};
