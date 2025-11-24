package com.rncomputebench

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages
        // Packages are now auto-linked via rn-compute-bench package
        // No manual registration needed!
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
