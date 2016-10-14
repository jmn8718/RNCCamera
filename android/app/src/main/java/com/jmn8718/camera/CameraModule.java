package com.jmn8718.camera;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by josenavarro on 14/10/16.
 */
public class CameraModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public static final String REACT_NAME = "CameraModule";
    public static final String TAG = "CameraModule";
    private static final int REQUEST_IMAGE_CAPTURE = 1;

    private Promise mPromise;

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return REACT_NAME;
    }

    @ReactMethod
    public void takePicture(Promise promise) {
        Log.d(TAG, "takePicture");
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            Log.w(TAG, "Activity doesn't exist");
            return;
        }

        try {
            if (mPromise != null) {
                promise.reject("error", "Work in progress");
            }
            mPromise = promise;

            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (takePictureIntent.resolveActivity(currentActivity.getPackageManager()) != null) {
                // Create the File where the photo should go
                File photoFile = null;
                try {
                    photoFile = createImageFile();
                } catch (IOException ex) {
                    // Error occurred while creating the File
                    Log.e(TAG, ex.getMessage(), ex);
                    mPromise.reject(ex);
                }
//                currentActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
                // Continue only if the File was successfully created
                if (photoFile != null) {
                    Uri photoURI = Uri.fromFile(photoFile);
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
                    currentActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            mPromise.reject(e);
        };
    }

    String mCurrentPhotoPath;

    private File createImageFile() throws IOException {
        // Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        Log.d(TAG, timeStamp);
        String imageFileName = "SYNC_" + timeStamp;
        File storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
//        File image = File.createTempFile(
//                imageFileName,  /* prefix */
//                ".jpg",         /* suffix */
//                storageDir      /* directory */
//        );

        File image = new File(storageDir + "/" + imageFileName + ".jpg");

        // Save a file: path for use with ACTION_VIEW intents
        mCurrentPhotoPath = image.getAbsolutePath();
        Log.d(TAG, mCurrentPhotoPath);
        return image;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.d(TAG, "onActivityResult");

        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == getCurrentActivity().RESULT_OK) {
            WritableMap map = Arguments.createMap();
            map.putString("uri", mCurrentPhotoPath);
            mPromise.resolve(map);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
