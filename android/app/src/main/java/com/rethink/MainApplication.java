package com.rethink;

import android.app.Application;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.delightfulstudio.wheelpicker.WheelPickerPackage;

//import io.invertase.firebase.RNFirebasePackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
//import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import com.horcrux.svg.SvgPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;

import com.oblador.vectoricons.VectorIconsPackage;

import cl.json.RNSharePackage;

import com.dooboolab.kakaologins.RNKakaoLoginsPackage;

import com.facebook.reactnative.androidsdk.FBSDKPackage;

import cl.json.ShareApplication;

import com.facebook.CallbackManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    @Override
    public String getFileProviderAuthority() {
        return BuildConfig.APPLICATION_ID + ".provider";
    }

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
//            return false;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new PickerPackage(),
                    new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
                    new WheelPickerPackage(),
//                    new RNFirebasePackage(),
//                    new RNFirebaseMessagingPackage(),
//                    new RNFirebaseNotificationsPackage(),
                    new SvgPackage(),
                    new ReactNativePushNotificationPackage(),
                    new BackgroundTimerPackage(),
                    new RNSharePackage(),
                    new RNViewShotPackage(),
                    new VectorIconsPackage(),
                    new RNKakaoLoginsPackage(),
                    new FBSDKPackage(mCallbackManager)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.e("key_hash" +
                        ":", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }

        FacebookSdk.sdkInitialize(getApplicationContext());
        SoLoader.init(this, /* native exopackage */ false);
    }

}
