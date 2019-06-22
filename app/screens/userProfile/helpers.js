import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import RNKakaoLogins from 'react-native-kakao-logins';

export function _customFacebookLogout() {
  _customKakaoLogout();
  if (AccessToken.getCurrentAccessToken() != null) {
    LoginManager.logOut(err => console.log("err 11", err));
  }
  // var current_access_token = '';
  // AccessToken.getCurrentAccessToken().then((data) => {
  //   current_access_token = data ? data.accessToken.toString() : '';
  // }).then(() => {
  //   let logout =
  //     new GraphRequest(
  //       "me/permissions/",
  //       {
  //         accessToken: current_access_token,
  //         httpMethod: 'DELETE'
  //       },
  //       (error, result) => {
  //         if (error) {
  //           if (__DEV__) console.log('Error fetching data: ' + error.toString());
  //         } else {
  //           LoginManager.logOut();
  //         }
  //       });
  //   new GraphRequestManager().addRequest(logout).start();
  // })
  //   .catch(error => {
  //     if (__DEV__) console.log('fb logout error', error)
  //   });
}

export function _customKakaoLogout() {
  return RNKakaoLogins.logout((err, result) => { });
}