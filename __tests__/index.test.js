import fsp from 'fs/promises';
import pageLoader from '../src/index.js';
import path from 'path';
import os from 'os';
import { generateFileName } from '../src/helpers.js';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios-http-adapter-commonjs/dist/AxiosHttpAdapter';

nock.disableNetConnect();

const url = 'http://localhost';
axios.defaults.adapter = httpAdapter;

let tempdir;

beforeEach(async () => {
  nock.cleanAll();
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('html match', async () => {
  const responseBefore = await fsp.readFile(
    path.join('.', '__fixtures__', 'resBefore'),
    'utf-8'
  );
  const responseAfter = await fsp.readFile(
    path.join('.', '__fixtures__', 'resAfter'),
    'utf-8'
  );
  nock('https://ru.hexlet.io/courses')
    .get(/\/courses/)
    .reply(200, responseBefore);
  await pageLoader(url, tempdir);
  const dataBody = await fsp.readFile(
    path.join(tempdir, generateFileName(url, '.html')),
    'utf-8'
  );
  expect(dataBody).toEqual(responseAfter);
});

