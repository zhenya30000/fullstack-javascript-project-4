import fsp from 'fs/promises';
import pageLoader from '../src/index.js';
import path from 'path';
import os from 'os';
import { generateFileName } from '../src/helpers.js';
import nock from 'nock';

const url = new URL('http://example.com/test');

let tempdir;

beforeEach(async () => {
  nock.cleanAll();
  tempdir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('data match', async () => {
  const responseBefore = await fsp.readFile(
    path.join('.', '__fixtures__', 'resBefore'),
    'utf-8'
  );
  const responseAfter = await fsp.readFile(
    path.join('.', '__fixtures__', 'resAfter'),
    'utf-8'
  );

  nock('http://example.com/test').get('/test').reply(200, responseBefore);
  console.log(tempdir);
  await pageLoader('http://example.com/test', tempdir);
  const dataBody = await fsp.readFile(
    path.join(tempdir, generateFileName(url, '.html')),
    'utf-8'
  );
  expect(dataBody).toEqual(responseAfter);
});