<template>
  <div class="floor-management q-pa-md" style="background: #2D2D3A; color: white;">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white;">
      Floor(s) for {{ customerName }}
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Floor" v-model:search-term="searchTerm" :has-selected="selectedFloors.length > 0"
      @add="openAddFloorDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredFloors" :columns="columns" :loading="loading" v-model:selected="selectedFloors"
      @row-click="goToZones" @edit="openEditFloorDialog" @delete="confirmDeleteSingle" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="floorDialog" :title="editingFloor ? 'Edit Floor' : 'Add Floor'" :is-valid="isFormValid"
      @save="saveFloor" @cancel="floorDialog = false">
      <q-input v-model="floorForm.name" label="Name" dark outlined class="q-mb-md"
        :rules="[val => !!val || 'Name is required']" />
      <q-select v-model="floorForm.buildingId" :options="buildingOptions" label="Building" dark outlined class="q-mb-md"
        :rules="[val => !!val || 'Building is required']" emit-value map-options />

      <q-input v-model.number="floorForm.lengthMeters" type="number" label="Length (meters)" dark outlined
        class="q-mb-md" :rules="[val => val > 0 || 'Length must be greater than 0']" />
      <q-input v-model.number="floorForm.widthMeters" type="number" label="Width (meters)" dark outlined class="q-mb-md"
        :rules="[val => val > 0 || 'Width must be greater than 0']" />

      <!-- Tile Layout Information -->
      <div v-if="floorForm.lengthMeters && floorForm.widthMeters" class="q-pa-sm q-mb-md"
        style="background: rgba(255,255,255,0.05); border-radius: 8px;">
        <div class="text-subtitle2 q-mb-sm">Tile Layout (600mm x 600mm tiles)</div>
        <div class="row q-gutter-md">
          <div>
            <div class="text-caption">Length Tiles</div>
            <div class="text-h6">{{ calculateTiles(floorForm.lengthMeters).toFixed(0) }}</div>
          </div>
          <div>
            <div class="text-caption">Width Tiles</div>
            <div class="text-h6">{{ calculateTiles(floorForm.widthMeters).toFixed(0) }}</div>
          </div>
          <div>
            <div class="text-caption">Total Tiles</div>
            <div class="text-h6">{{ calculateTotalTiles().toFixed(0) }}</div>
          </div>
        </div>
      </div>
    </FormDialog>

    <!-- Confirmation Dialog Component -->
    <ConfirmationDialog v-model="deleteConfirmDialog" :message="deleteConfirmMessage" @confirm="executeDelete"
      @cancel="deleteConfirmDialog = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { floorService, Floor } from '../../services/floorService';
import { customerService } from '../../services/customerService';
import { buildingService } from '../../services/buildingService';
import SearchHeader from '../FormComponents/SearchHeader.vue';
import DataTable from '../FormComponents/DataTable.vue';
import FormDialog from '../FormComponents/FormDialog.vue';
import ConfirmationDialog from '../FormComponents/ConfirmationDialog.vue';

interface Building {
  id: number;
  name: string;
}

interface FloorFormData {
  name: string;
  buildingId: number | null;
  lengthMeters: number;
  widthMeters: number;
}

export default defineComponent({
  name: 'FloorList',
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const customerName = ref('');
    const floors = ref<Floor[]>([]);
    const buildings = ref<Building[]>([]);
    const loading = ref(false);
    const floorDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingFloor = ref<Floor | null>(null);
    const searchTerm = ref('');
    const selectedFloors = ref<Floor[]>([]);
    const deleteConfirmMessage = ref('');
    const deleteMode = ref<'single' | 'multiple'>('single');
    const singleDeleteId = ref<number | null>(null);

    const floorForm = ref<FloorFormData>({
      name: '',
      buildingId: null,
      lengthMeters: 0,
      widthMeters: 0,
    });

    const TILE_SIZE = 0.6; // 600mm = 0.6m

    const calculateTiles = (meters: number) => {
      return meters / TILE_SIZE;
    };

    const calculateTotalTiles = () => {
      if (!floorForm.value.lengthMeters || !floorForm.value.widthMeters) return 0;
      return calculateTiles(floorForm.value.lengthMeters) * calculateTiles(floorForm.value.widthMeters);
    };

    const isFormValid = computed(() => {
      return (
        !!floorForm.value.name &&
        !!floorForm.value.buildingId &&
        floorForm.value.lengthMeters > 0 &&
        floorForm.value.widthMeters > 0
      );
    });

    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'name', label: 'Name', field: 'name', sortable: true },
      {
        name: 'building',
        label: 'Building',
        field: (row: Floor) => row.building?.name,
        sortable: true
      },
      {
        name: 'length',
        label: 'Length (m)',
        field: 'lengthMeters',
        sortable: true
      },
      {
        name: 'width',
        label: 'Width (m)',
        field: 'widthMeters',
        sortable: true
      },
      {
        name: 'tiles',
        label: 'Total Tiles',
        field: (row: Floor) => row.lengthMeters && row.widthMeters ?
          Math.ceil((row.lengthMeters / TILE_SIZE) * (row.widthMeters / TILE_SIZE)) : 'N/A',
        sortable: true
      }
    ];

    const buildingOptions = computed(() => {
      return buildings.value.map(building => ({
        label: building.name,
        value: building.id,
      }));
    });

    const filteredFloors = computed(() => {
      return floors.value.filter(floor =>
        floor.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const fetchFloors = async () => {
      loading.value = true;
      try {
        floors.value = await floorService.getFloorsByCustomerId(props.customerId);
      } catch (error) {
        console.error('Failed to fetch floors:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCustomerName = async () => {
      try {
        const customer = await customerService.getCustomerById(props.customerId);
        customerName.value = customer.name;
      } catch (error) {
        console.error('Failed to fetch customer name:', error);
      }
    };

    const fetchBuildings = async () => {
      try {
        buildings.value = await buildingService.getBuildingsByCustomerId(props.customerId);
      } catch (error) {
        console.error('Failed to fetch buildings:', error);
      }
    };

    const openAddFloorDialog = () => {
      editingFloor.value = null;
      floorForm.value = {
        name: '',
        buildingId: null,
        lengthMeters: 0,
        widthMeters: 0,
      };
      floorDialog.value = true;
    };

    const openEditFloorDialog = (floor: Floor) => {
      editingFloor.value = floor;
      floorForm.value = {
        name: floor.name,
        buildingId: floor.buildingId,
        lengthMeters: floor.lengthMeters || 0,
        widthMeters: floor.widthMeters || 0,
      };
      floorDialog.value = true;
    };

    const saveFloor = async () => {
      if (!floorForm.value.buildingId) return;

      try {
        const floorData = {
          ...floorForm.value,
          customerId: props.customerId,
          buildingId: floorForm.value.buildingId,
        };

        if (editingFloor.value) {
          await floorService.updateFloor(editingFloor.value.id, floorData);
        } else {
          await floorService.createFloor(floorData);
        }
        await fetchFloors();
        floorDialog.value = false;
        emit('floor-updated');
      } catch (error) {
        console.error('Failed to save floor:', error);
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = 'single';
      singleDeleteId.value = id;
      deleteConfirmMessage.value = 'Are you sure you want to delete this floor?';
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = 'multiple';
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedFloors.value.length} floor(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === 'single' && singleDeleteId.value !== null) {
        await deleteSingleFloor(singleDeleteId.value);
      } else if (deleteMode.value === 'multiple') {
        await deleteSelectedFloors();
      }
    };

    const deleteSingleFloor = async (id: number) => {
      try {
        await floorService.deleteFloor(id);
        await fetchFloors();
        emit('floor-updated');
      } catch (error) {
        console.error('Failed to delete floor:', error);
      }
    };

    const deleteSelectedFloors = async () => {
      try {
        for (const floor of selectedFloors.value) {
          await floorService.deleteFloor(floor.id);
        }
        await fetchFloors();
        selectedFloors.value = [];
        emit('floor-updated');
      } catch (error) {
        console.error('Failed to delete selected floors:', error);
      }
    };

    const goToZones = (floorId: number) => {
      if (selectedFloors.value.length === 0) {
        router.push({ name: 'ZoneList', params: { floorId: floorId.toString() } });
      }
    };

    onMounted(() => {
      fetchFloors();
      fetchCustomerName();
      fetchBuildings();
    });

    watch(() => props.customerId, () => {
      fetchFloors();
      fetchCustomerName();
      fetchBuildings();
    });

    return {
      customerName,
      floors,
      filteredFloors,
      columns,
      loading,
      floorDialog,
      deleteConfirmDialog,
      deleteConfirmMessage,
      floorForm,
      editingFloor,
      searchTerm,
      selectedFloors,
      buildingOptions,
      isFormValid,
      openAddFloorDialog,
      openEditFloorDialog,
      saveFloor,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      goToZones,
      calculateTiles,
      calculateTotalTiles,
    };
  },
});
</script>

<style scoped>
.hover-row:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

.q-table tbody td {
  font-size: 0.875rem;
}

.q-table th {
  font-size: 0.875rem;
}
</style>
