<script setup>
import Swal from 'sweetalert2'
import { ref, defineEmits } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import disableVerifyVbmeta from 'vbmeta-disabler';

const emit = defineEmits(['patch'])
const slotToggle = ref('a')
const data = ref([])

const deviceStore = useDeviceStore()

const columns = ref([
  {
    field: 'filename',
    label: 'Filename'
  },
  {
    field: 'partition',
    label: 'Partition (for flashing)',
    position: 'centered'
  },
  {
    field: 'size',
    label: 'Size',
    position: 'centered'
  },
  {
    field: 'deleteButton',
    label: 'Delete',
    position: 'centered'
  },
  {
    field: 'slot',
    label: 'Slot',
    position: 'centered'
  }
])

const setFlashSlot = (index) => {
  console.log(index)
  console.log(data.value)
  data.value[index].slot = data.value[index].slot == 'a' ? 'b' : 'a'
}

const deleteDropFile = (filename) => {
  const index = data.value.findIndex((file) => file.filename == filename)
  data.value.splice(index, 1)
}

const addFile = async (newFiles) => {
  for (let i=0; i < newFiles.length; i++) {
    const file = {
        filename: newFiles[i].name,
        partition: newFiles[i].name.split('.')[0],
        slot: slotToggle.value,
        size: (newFiles[i].size / 1024 / 1024).toFixed(2) + ' MB',
        blob: await disableVerifyVbmeta(newFiles[i])

    }
    data.value.push(file)
  }
  console.log(data.value)
}

const startPatch = () => {
    if (!data.value.length) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You need to select at least one file!',
        })
        return
    }
    deviceStore.flashObject = {
      files: data.value,
    }
    emit('patch', true)
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
                    <o-button v-if="column.field == 'slot'" @click="setFlashSlot(data.findIndex((file) => file.filename == row.filename))" color="is-danger">{{ row.slot }}</o-button>
                    <o-input v-model="row.partition"  v-if="column.field == 'partition'"></o-input>
                    <o-button v-if="column.field == 'deleteButton'" @click="deleteDropFile(row.filename)" color="is-danger">Delete</o-button>
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
        <o-field id="flash">
            <o-button size="large" @click="startPatch()">Patch</o-button>
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

