import create from 'legions';
import App from './containers/App';
import '../common/components/nprogress/index.css';
import { legionsThirdpartyPlugin } from 'legions-thirdparty-plugin';
import { legionsThirdpartyMap } from '../common/constants/legionsConfig';
legionsThirdpartyPlugin.use([
  legionsThirdpartyMap.excel,
  legionsThirdpartyMap.clipboard,
  legionsThirdpartyMap.html2canvas,
  legionsThirdpartyMap.jsBarcode,
  legionsThirdpartyMap.dexie,
]);
if (!global['_babelPolyfill']) {
  // 为了解决重复引入的问题
  require('babel-polyfill');
}

const app = create({ enableDevTools: false, router: true, history: null });
app.start(App, '#react-dms-restruct');

// @ts-ignore
if (module.hot && process.env.NODE_ENV === 'dev') {
  // @ts-ignore
  module.hot.accept();
}
