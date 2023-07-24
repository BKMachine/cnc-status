<template>
  <v-btn color="blue" @click="router.push({ name: 'home' })">
    <v-icon> mdi-home </v-icon>
  </v-btn>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="machines"
      class="elevation-1"
      hover
      items-per-page="-1"
      fixed-header
      height="700"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Machines</v-toolbar-title>
          <v-spacer />
          <v-dialog v-model="dialog" max-width="800px">
            <template #activator="{ props }">
              <v-btn
                color="primary"
                class=""
                v-bind="props"
                variant="elevated"
                prepend-icon="mdi-plus-circle-outline"
              >
                New Machine
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-form v-model="valid" @submit.prevent="save">
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                        :rules="rules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.serialNumber"
                        label="Serial Number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field v-model="editedItem.model" label="Model"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-radio-group v-model="editedItem.brand" inline :rules="rules">
                        <template #label>
                          <span class="mr-3">Brand</span>
                          <img
                            v-if="editedItem.brand"
                            :src="logos.brand[editedItem.brand]"
                            alt=""
                          />
                        </template>
                        <v-radio label="Haas" value="haas"></v-radio>
                        <v-radio label="Mori Seiki" value="mori"></v-radio>
                        <v-radio label="Fanuc" value="fanuc"></v-radio>
                        <v-radio label="Mazak" value="mazak"></v-radio>
                        <v-radio label="Hanwha" value="hanwha"></v-radio>
                        <v-radio label="Mitsubishi" value="mitsubishi"></v-radio>
                        <v-radio label="Doosan" value="doosan"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-radio-group v-model="editedItem.source" inline :rules="rules">
                        <template #label>
                          <span class="mr-3">Source</span>
                          <img
                            v-if="editedItem.source"
                            :src="logos.source[editedItem.source]"
                            alt=""
                          />
                        </template>
                        <v-radio label="Focas" value="focas"></v-radio>
                        <v-radio label="Arduino" value="arduino"></v-radio>
                        <v-radio label="MTConnect" value="mtconnect"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.location"
                        :label="locationLabel"
                        :rules="rules"
                        :messages="[locationMessage]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-radio-group v-model="editedItem.type" inline label="Type" :rules="rules">
                        <template #label>
                          <span class="mr-3">Type</span>
                          <img v-if="editedItem.type" :src="logos.type[editedItem.type]" alt="" />
                        </template>
                        <v-radio label="Mill" value="mill"></v-radio>
                        <v-radio label="Lathe" value="lathe"></v-radio>
                        <v-radio label="Swiss" value="swiss"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-radio-group v-model="editedItem.paths" inline label="Paths" :rules="rules">
                        <v-radio label="Single" value="1"></v-radio>
                        <v-radio label="Dual" value="2"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                  <v-btn color="blue-darken-1" variant="text" type="submit">Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">
                Are you sure you want to delete
                <span :class="{ 'delete-name': editedItem.name }">
                  {{ editedItem.name || 'this item' }}
                </span>
                ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.brand`]="{ item }">
        <img :src="logos.brand[item.brand]" alt="" />
      </template>
      <template #[`item.hidden`]="{ item }">
        <v-checkbox-btn
          v-model="item.columns.hidden"
          @change="toggleHide($event, item.raw.id)"
        ></v-checkbox-btn>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon size="small" class="me-2" @click="openMachine(item.raw)"> mdi-open-in-app </v-icon>
        <v-icon size="small" class="me-2" @click="editItem(item.raw)"> mdi-pencil </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { nextTick, computed, watch, ref } from 'vue';
import axios from '@/plugins/axios';
import { useRouter } from 'vue-router';
import { isHidden, hide, unHide } from '@/plugins/hide_machine';
import logos from '@/plugins/dynamic_logos';

const store = useStore();
const router = useRouter();
const valid = ref(false);

const headers = [
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Brand', key: 'brand' },
  { title: 'Model', key: 'model' },
  { title: 'Source', key: 'source' },
  { title: 'Type', key: 'type' },
  { title: 'Hidden', key: 'hidden', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({} as MachineStatus);

const machines = computed(() => {
  return store.state.machines.map((x) => {
    return {
      ...x,
      hidden: isHidden(x.id),
    };
  });
});

watch(dialog, (open) => {
  if (!open) close();
});

watch(dialogDelete, (open) => {
  if (!open) closeDelete();
});

function editItem(item: MachineStatus) {
  editedIndex.value = store.state.machines.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(item: MachineStatus) {
  editedIndex.value = store.state.machines.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogDelete.value = true;
}

function deleteItemConfirm() {
  axios
    .delete(`/machine/${editedItem.value.id}`)
    .then(() => {
      store.commit('deleteMachine', editedIndex.value);
    })
    .catch(() => {
      alert(`There was an error deleting ${editedItem.value.name}`);
    })
    .finally(() => {
      closeDelete();
    });
}

function close() {
  dialog.value = false;
  sleep().then(() => {
    nextTick(() => {
      editedItem.value = {} as MachineStatus;
      editedIndex.value = -1;
    });
  });
}

function closeDelete() {
  dialogDelete.value = false;
  sleep().then(() => {
    nextTick(() => {
      editedItem.value = {} as MachineStatus;
      editedIndex.value = -1;
    });
  });
}

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Machine' : 'Edit Machine';
});

async function save() {
  if (!valid.value) return;
  if (editedIndex.value > -1) {
    axios
      .put(`/machine/${editedItem.value.id}`, editedItem.value)
      .then(({ data }) => {
        store.commit('updateMachine', { index: editedIndex.value, data });
      })
      .catch(() => {
        alert('Error saving edited machine.');
      })
      .finally(() => {
        close();
      });
  } else {
    axios
      .post('/machine', editedItem.value)
      .then(({ data }) => {
        store.commit('addMachine', data);
      })
      .catch(() => {
        alert('Error saving new machine.');
      })
      .finally(() => {
        close();
      });
  }
}

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
}

const rules = [
  (value: string) => {
    if (value) return true;
    return 'Required';
  },
];

const locationLabel = computed(() => {
  const source = editedItem.value.source;
  if (source === 'focas') return 'Machine ID';
  else if (source === 'arduino') return 'Arduino URL';
  else if (source === 'mtconnect') return 'Device ID';
  return 'Location';
});

const locationMessage = computed(() => {
  const source = editedItem.value.source;
  if (source === 'focas')
    return 'Enter the machine id found in the fanuc-driver config.machines.yml file.';
  else if (source === 'arduino') return 'http://10.30.1.XXX:8193';
  else if (source === 'mtconnect')
    return 'Enter the device id found in the mtconnect Devices.xml file.';
  return '';
});

function openMachine(item: MachineStatus) {
  router.push({ name: 'machine', params: { id: item.id } });
}

function toggleHide(e, id: string) {
  if (e.target.checked) {
    hide(id);
  } else {
    unHide(id);
  }
}
</script>

<style scoped>
.machine {
  color: #fff;
  font-size: 24px;
  padding: 5px;
  border: 1px solid #000;
  border-radius: 10px;
  margin: 5px;
  background: #6c6c6c;
}

.machine img {
  height: 24px;
  position: relative;
  top: 3px;
}
.delete-name {
  color: cyan;
}
img {
  height: 25px;
  opacity: 1;
}
</style>
