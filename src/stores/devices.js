import { FastbootDevice } from 'android-fastboot'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('devices', {
  // arrow function recommended for full type inference
  state: () => {
    return {
        device: FastbootDevice,
        isUnlocked: Boolean,
    }
  }
})