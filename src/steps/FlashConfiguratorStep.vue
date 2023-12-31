<script setup>
import { ref, defineEmits } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { downloadFileWithProgress } from '@/utils/download'
import ProgressBar from '../components/ProgressBar.vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['flash'])

const data = ref([])
const slotToggle = ref('a')
const wipeToggle = ref(false)
const verityToggle = ref(false)
const hasVbmeta = ref(false)

const deviceStore = useDeviceStore()

data.value = deviceStore.flashObject.files ?? []
slotToggle.value = deviceStore.flashObject.options?.ab
wipeToggle.value = deviceStore.flashObject.options?.cleanFlash
verityToggle.value = deviceStore.flashObject.options?.disableVerity

if (deviceStore.isABDevice) {
  deviceStore.device.getVariable("current-slot").then((slot) => {
    if (slot == "b") {
      slotToggle.value = "a"
    }
    else {
      slotToggle.value = "b"
    }
  })
}

const columns = ref([
  {
    field: 'filename',
    label: 'Filename'
  },
  {
    field: 'partition',
    label: 'Partition',
    position: 'centered'
  },
  {
    field: 'size',
    label: 'Size',
    position: 'centered'
  },
  {
    field: 'slot',
    label: 'Slot',
    position: 'centered'
  },
  {
    field: 'deleteButton',
    label: 'Delete',
    position: 'centered'
  }
])

for (let i = 0; i < data.value.length; i++) {
  if (typeof data.value[i].blob === 'string') {
    downloadFileWithProgress(data.value[i].blob, (progress) => {
      data.value[i].progress = progress
    }).then((blob) => {
      data.value[i].blob = blob;
      data.value[i].size = (data.value[i].blob.size / 1024 / 1024).toFixed(2) + ' MB'
    }).catch((err) => {
      Swal.fire({
        title: 'Error',
        text: `Unable to download ${data.value[i].filename}`,
        icon: 'error',
        confirmButtonText: 'Skip this file'
      }).then(() => {
        deleteDropFile(data.value[i].filename)
      })
    })
  }
}

const deleteDropFile = (filename) => {
  const index = data.value.findIndex((file) => file.filename == filename)

  if (data.value[index].partition == "vbmeta") {
    hasVbmeta.value = false;
    verityToggle.value = false;
  }
  data.value.splice(index, 1)
}

const setFlashSlot = (index) => {
  data.value[index].slot = data.value[index].slot == 'a' ? 'b' : 'a'
}

const addFile = (newFiles) => {
  for (let i=0; i < newFiles.length; i++) {
    const file = {
        filename: newFiles[i].name,
        partition: newFiles[i].name.split('.')[0],
        size: (newFiles[i].size / 1024 / 1024).toFixed(2) + ' MB',
        slot: deviceStore.isABDevice ? slotToggle.value : null,
        blob: newFiles[i]
    }
    if (file.partition == "vbmeta") hasVbmeta.value = true;
    data.value.push(file)
  }
  console.log(data.value)
}

const startFlash = () => {
    deviceStore.flashObject = {
      files: data.value,
      options: {
        cleanFlash: wipeToggle.value,
        disableVerity: verityToggle.value,
        ab: slotToggle.value
      }
    }
    emit('flash', true)
}
</script>

<template>
    <main>
        <o-field id="test" :addons="false">
              <o-table v-if="data.length > 0" :paginated="data.length > 0" :per-page="7" :striped="true" :data="data">
                <o-table-column
                    v-for="(column, index) in columns"
                    :key="index"
                    v-bind="column"
                    #default="{ row }">
                    <span v-if="column.field !== 'slot' && column.field !== 'partition'">{{ row[column.field] }}</span>
                    <o-button v-if="column.field == 'slot' && deviceStore.isABDevice" @click="setFlashSlot(data.findIndex((file) => file.filename == row.filename))" color="is-danger">{{ row.slot }}</o-button>
                    <o-input v-model="row.partition"  v-if="column.field == 'partition'"></o-input>
                    <o-button v-if="column.field == 'deleteButton'" @click="deleteDropFile(row.filename)" color="is-danger">Delete</o-button>
                    <ProgressBar v-if="column.field == 'size' && !row[column.field]" :progress="row.progress"/>
                </o-table-column>
              </o-table>
            <o-upload :native=true @update:modelValue="addFile($event)" multiple drag-drop>
                <section class="ex-center">
                <p>
                    <o-icon icon="file-upload" size="large">
                    </o-icon>
                </p>
                <p>Drop your files</p>
                </section>
            </o-upload>
        </o-field>
        <o-field id="toggles">
          <o-tooltip label="This will wipe your phone">
            <o-switch v-model="wipeToggle">Wipe Data</o-switch>
          </o-tooltip>
          <o-tooltip label="Allow booting unsigned images">
            <o-switch :disabled="!hasVbmeta" v-model="verityToggle">Disable Verity</o-switch>
          </o-tooltip>
          <o-tooltip label="Choose between A or B slot" v-if="deviceStore.isABDevice">
            <o-switch v-model="slotToggle" true-value="b" false-value="a">A/B</o-switch>
          </o-tooltip>
        </o-field>
        <o-field id="flash">
            <o-button size="large" @click="startFlash()" :disabled="!(data.length > 0)">Flash</o-button>
        </o-field>
    </main>
</template>

<style scoped>
main {
  align-items: center;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 25px;
  display: flex;
  justify-content: space-evenly;
}

.o-switch {
  flex-direction: column;
  margin: 20px 20px;
}

.o-tip {
  flex: 1;
}

main {
  --oruga-input-max-width: 100%;
}

.o-field {
  display: flex;
  flex-direction: column;
  justify-content: center;

}

#test {
  flex: 1 0 auto;
  width: 70%;
  margin-top: 30px;
  height: 540px;
}

#flash {
  flex: 1 0 auto;
}

#toggles {
  flex: 0 0 auto;
  margin: 0px;
}

</style>

