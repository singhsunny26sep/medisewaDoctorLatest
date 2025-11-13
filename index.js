/**
 * @format
 */
// import './gesture-handler';
import { decode, encode } from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
