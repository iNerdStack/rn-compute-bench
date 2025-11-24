package com.rncomputebench.lib

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.turbomodule.core.interfaces.TurboModule  // Still needed for Rust modules
import com.facebook.soloader.SoLoader
import javax.annotation.Nonnull

class RnComputeBenchPackage : BaseReactPackage() {
  companion object {
    val JNI_PREPARE_MODULE_NAME = setOf(
      "__crabyBruteForceRust_JNI_prepare__"
    )
  }

  init {
    SoLoader.loadLibrary("cxx-rn-compute-bench")
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when {
      name in JNI_PREPARE_MODULE_NAME -> {
        nativeSetDataPath(reactContext.filesDir.absolutePath)
        RnComputeBenchPackage.TurboModulePlaceholder(reactContext, name)
      }
      name == NativeBruteForceKotlinModule.NAME -> {
        NativeBruteForceKotlinModule(reactContext)
      }
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      JNI_PREPARE_MODULE_NAME.forEach { name ->
        moduleInfos[name] = ReactModuleInfo(
          name,
          name,
          false,  // canOverrideExistingModule
          false,  // needsEagerInit
          false,  // isCxxModule
          true,  // isTurboModule
        )
      }
      // Register Kotlin module (using legacy API for compatibility)
      moduleInfos[NativeBruteForceKotlinModule.NAME] = ReactModuleInfo(
        NativeBruteForceKotlinModule.NAME,
        NativeBruteForceKotlinModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        false,  // isTurboModule - set to false for legacy API
      )
      moduleInfos
    }
  }

  private external fun nativeSetDataPath(dataPath: String)

  class TurboModulePlaceholder(reactContext: ReactApplicationContext?, private val name: String) :
    ReactContextBaseJavaModule(reactContext),
    TurboModule {
    @Nonnull
    override fun getName(): String {
      return name
    }
  }
}
