<template>
    <main>

        <o-field :addons="false">
            <o-table v-if="dropFiles.length > 0" :striped="true" :data="data">
                <o-table-column
                    v-for="column in columns"
                    v-bind="column"
                    #default="{ row }">
                    <span v-if="column.field !== 'slot' && column.field !== 'partition'">{{ row[column.field] }}</span>
                    <o-button v-if="column.field == 'slot'" @click="setFlashSlot(row.id)" color="is-danger">{{ row.slot }}</o-button>
                    <o-input v-model="row.partition"  v-if="column.field == 'partition'"></o-input>
                    <o-button v-if="column.field == 'deleteButton'" @click="deleteDropFile(row.id)" color="is-danger">Delete</o-button>
                </o-table-column>
            </o-table>
            <o-upload v-model="dropFiles" multiple drag-drop>
                <section class="ex-center">
                <p>
                    <o-icon icon="upload" size="is-large">
                    </o-icon>
                </p>
                <p>Drop your files here or click to upload</p>
                </section>
            </o-upload>
        </o-field>
        <o-field>
            <o-switch v-model="wipeToggle">Clean Flash</o-switch>
            <o-switch :disabled="!hasVbmeta" v-model="verityToggle">Disable Verity</o-switch>
            <o-switch v-model="slotToggle" true-value="b" false-value="a">A/B</o-switch>
        </o-field>
        <o-field>
            <o-button @click="startFlash()">Flash</o-button>
        </o-field>
    </main>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['flash'])

const dropFiles = ref([])
const data = ref([])
const slotToggle = ref('a')
const wipeToggle = ref(false)
const verityToggle = ref(false)
const hasVbmeta = ref(false)
const columns = ref([
  {
    field: 'id',
    label: 'ID',
    width: '40',
    numeric: true,
    position: 'centered'
  },
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

const deleteDropFile = (index) => {
  if (dropFiles.value[index].name.split('.')[0] == "vbmeta") {
    hasVbmeta.value = false;
    verityToggle.value = false;
  }
  dropFiles.value.splice(index, 1)
  data.value.splice(index, 1)
}

const setFlashSlot = (index) => {
  data.value[index].slot = data.value[index].slot == 'a' ? 'b' : 'a'
}

watch(dropFiles, (newDropFiles) => {
  for (let i = data.value.length; i < newDropFiles.length; i++) {
    let file = {
      id: i,
      filename: newDropFiles[i].name,
      partition: newDropFiles[i].name.split('.')[0],
      size: (newDropFiles[i].size / 1024 / 1024).toFixed(2) + ' MB',
      slot: slotToggle.value
    }
    data.value.push(file)

    if (newDropFiles[i].name.split('.')[0] == "vbmeta") hasVbmeta.value = true;
  }
}, { deep: true })

const startFlash = () => {
    if (!dropFiles.value.length) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You need to select at least one file!',
        })
        return
    }
    const ret = {
      files: dropFiles.value,
      data: data.value,
      quantity: dropFiles.value.length,
      options: {
        cleanFlash: wipeToggle.value,
        disableVerity: verityToggle.value,
        ab: slotToggle.value
      }
    }
    emit('flash', ret)
}
</script>

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

main {
    --oruga-input-max-width: 100%;
}

.o-field {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

