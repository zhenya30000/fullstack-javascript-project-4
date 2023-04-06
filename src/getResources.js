import * as cheerio from 'cheerio';
import fs from 'fs';
import fsp from 'fs/promises';
import axios from 'axios';
import path from 'path';
import { cwd } from 'process';

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
  console.log(imageLinks);
  return imageLinks;
};

const downloadImage = (imageLinks, filePath) => {
  Promise.all(
    imageLinks.map((imageUrl) => {
      const imageName = imageUrl.split('/').at(-1);
      console.log(`${imageUrl}`);
      axios.get(`${imageUrl}`, { responseType: 'stream' }).then((response) => {
        console.log(response);
        response.data.pipe(
          fs.createWriteStream(path.join(filePath, imageName))
        );
      });
    })
  );
};

export const getResources = (url, resourcesPath) => {
  axios.get(url).then((response) => {
    const imageLinks = getImageLinks(response.data);
    fsp.mkdir(path.join(cwd(), resourcesPath)).then(() => {
      downloadImage(imageLinks, resourcesPath);
    });
  });
};
