import * as cheerio from 'cheerio';
import fs from 'fs';
import fsp from 'fs/promises';
import axios from 'axios';
import path from 'path';
import { generateFileName } from './helpers.js';

const getImageLinks = (html) => {
  const $ = cheerio.load(html);
  const images = $('img');
  const imageLinks = [];
  images.each((i, img) => {
    const src = $(img).attr('src');
    const ext = src.split('.').at(-1);
    if (ext === 'png' || ext === 'jpg') {
      imageLinks.push(src);
    }
  });
  return imageLinks;
};

const downloadImage = (imageLinks, filePath) => {
  Promise.all(
    imageLinks.map((imageUrl) => {
      const fileType = `.${imageUrl.split('.').at(-1)}`;
      const imageName = generateFileName(imageUrl, fileType);
      axios.get(`${imageUrl}`, { responseType: 'stream' }).then((response) => {
        response.data.pipe(
          fs.createWriteStream(path.join(filePath, imageName))
        );
      });
    })
  );
};

export const getAssets = (url, resourcesPath) => {
  axios.get(url).then((response) => {
    const imageLinks = getImageLinks(response.data);
    fsp
      .mkdir(resourcesPath)
      .then(() => {
        console.log('Done creating dir', resourcesPath);
        downloadImage(imageLinks, resourcesPath);
      })
      .catch(() => downloadImage(imageLinks, resourcesPath));
  });
};
