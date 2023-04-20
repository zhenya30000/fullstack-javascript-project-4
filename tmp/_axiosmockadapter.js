/* import fsp from 'fs/promises';
import pageLoader from '../src/index.js';
import path from 'path';
import os from 'os';
import { generateFileName } from '../src/helpers.js';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getLinks } from '../src/getAssets.js';
import { link } from 'fs';

const mock = new MockAdapter(axios);

const url = 'https://ru.hexlet.io/courses';

let tempdir;

beforeEach(async () => {
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('update links', async () => {
  const responseBefore = await fsp.readFile(
    path.join('.', '__fixtures__', 'resBefore'),
    'utf-8'
  );
  const responseAfter = await fsp.readFile(
    path.join('.', '__fixtures__', 'resAfter'),
    'utf-8'
  );

  const linkData = 'link data';
  const imageLinks = getLinks(responseBefore);
  console.log(imageLinks);
  imageLinks.forEach((link) => {
    const imageMock = generateFileName(`${url}${link}`);
    console.log(imageMock);
    mock.onGet(imageMock).reply(200, linkData);
  });

  mock.onGet(url).reply(200, responseBefore);

  await pageLoader(url, tempdir);
  const dataBody = await fsp.readFile(
    path.join(tempdir, generateFileName(url, '.html')),
    'utf-8'
  );
  expect(dataBody.data).toEqual(responseAfter);
});
 */