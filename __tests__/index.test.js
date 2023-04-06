import fsp from 'fs/promises';
import pageLoader from '../src/index.js';
import path from 'path';
import os from 'os';
import { generateFileName } from '../src/helpers.js';
import nock from 'nock';

const url = new URL('https://ru.hexlet.io/courses');

let expectedResponse;
let tempdir;

beforeEach(async () => {
  expectedResponse = await fsp.readFile(
    path.join('.', '__fixtures__', 'expectedResponse'),
    'utf-8'
  );
  nock(url.origin).get(url.pathname).reply(200, expectedResponse);
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('data match', async () => {
  await pageLoader(url, tempdir);
  const dataBody = await fsp.readFile(
    path.join(tempdir, generateFileName(url)),
    'utf-8'
  );
  expect(dataBody).toEqual(expectedResponse);
});

test('download files', async () => {
  const htmlBefore = fsp.readFile(
    path.join('.', '__fixtures__', 'getResBefore'),
    'utf-8'
  );
  const htmlAfter = fsp.readFile(
    path.join('.', '__fixtures__', 'getResAfter'),
    'utf-8'
  );
  nock(url.origin).get(url.pathname).reply(200, htmlBefore);
  await pageLoader(url, tempdir);
  const dataBody = await fsp.readFile(
    path.join(tempdir, generateFileName(url)),
    'utf-8'
  );
  expect(dataBody).toEqual(htmlAfter);
});
