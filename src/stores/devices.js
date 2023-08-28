import { FastbootDevice } from 'android-fastboot'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('devices', {
  // arrow function recommended for full type inference
  state: () => {
    return {
        device: FastbootDevice,
        manufacturer: String,
        isUnlocked: Boolean,
        flashObject: Object,
        isABDevice: Boolean,
    }
  }
})