package com.vimeo.capacitor.videonativebridge;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "VideoNativeBridge")
public class VideoNativeBridgePlugin extends Plugin {

    @PluginMethod
    public void isNativePlayerActive(PluginCall call) {
        call.reject("Not implemented on Android");
    }

    @PluginMethod
    public void getPlayerState(PluginCall call) {
        call.reject("Not implemented on Android");
    }

    @PluginMethod
    public void play(PluginCall call) {
        call.reject("Not implemented on Android");
    }

    @PluginMethod
    public void pause(PluginCall call) {
        call.reject("Not implemented on Android");
    }

    @PluginMethod
    public void seek(PluginCall call) {
        call.reject("Not implemented on Android");
    }

    @PluginMethod
    public void setVolume(PluginCall call) {
        call.reject("Not implemented on Android");
    }
}
