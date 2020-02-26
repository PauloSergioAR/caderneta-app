import { LoginManager } from 'react-native-fbsdk'

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;


export function login(callback) {
  LoginManager.logInWithPermissions(['public_profile']).then(
    async function (result) {
      callback(result)
    },
    function (error) {
      callback({ error: error })
    }
  );
}

export async function getNameAndFacebookId(callback) {
  let infoRequest = new GraphRequest('/me', null, callback)
  new GraphRequestManager().addRequest(infoRequest).start()
}