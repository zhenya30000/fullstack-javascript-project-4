import axios from 'axios';
import debug from 'debug';

const logAxios = debug('axios');

export default (url) => axios.get(url).catch((e) => logAxios(e));
