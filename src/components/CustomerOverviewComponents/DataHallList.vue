<template>
  <div class="datahall-management q-pa-md" style="background: #2d2d3a; min-height: 100vh; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Data Hall(s) for {{ customerName }}
    </div>

    <!-- Search and Actions Header -->
    <search-header v-model:searchTerm="searchTerm" item-name="Data Hall" :hasSelected="selectedDataHalls.length > 0"
      @add="openAddDataHallDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table -->
    <data-table :rows="filteredDataHalls" :columns="columns" :loading="loading" v-model:selected="selectedDataHalls"
      @row-click="navigateToManagement" @edit="openEditDataHallDialog" @delete="confirmDeleteSingle" />

    <!-- Add/Edit Form Dialog -->
    <form-dialog v-model="dataHallDialog" :title="editingDataHall ? 'Edit Data Hall' : 'Add Data Hall'"
      :isValid="!!dataHallForm.name && !!dataHallForm.floorId" @save="saveDataHall" @cancel="dataHallDialog = false">
      <q-input v-model="dataHallForm.name" label="Name" dark outlined class="q-mb-md"
        :rules="[(val) => !!val || 'Name is required']" />

      <q-select v-model="dataHallForm.floorId" :options="floorOptions" label="Select Floor" dark outlined
        class="q-mb-md" option-value="id" option-label="name" map-options emit-value
        :rules="[(val) => !!val || 'Floor is required']" />

      <!-- Tile Configuration -->
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input v-model.number="dataHallForm.tilesLength" type="number" label="Length (tiles)" dark outlined
            class="q-mb-md" @update:model-value="updateLayout" :rules="[
              (val) => val > 0 || 'Length must be greater than 0',
              (val) => Number.isInteger(val) || 'Length must be a whole number',
            ]" />
        </div>
        <div class="col-6">
          <q-input v-model.number="dataHallForm.tilesWidth" type="number" label="Width (tiles)" dark outlined
            class="q-mb-md" @update:model-value="updateLayout" :rules="[
              (val) => val > 0 || 'Width must be greater than 0',
              (val) => Number.isInteger(val) || 'Width must be a whole number',
            ]" />
        </div>
      </div>

      <!-- Layout Preview -->
      <div class="layout-preview q-pa-md bg-dark rounded-borders">
        <div class="text-subtitle2 q-mb-sm">Layout Preview</div>
        <div class="row q-col-gutter-y-md">
          <div class="col-12">
            <span class="text-grey">Length: {{ lengthInMeters }} meters</span>
          </div>
          <div class="col-12">
            <span class="text-grey">Width: {{ widthInMeters }} meters</span>
          </div>
          <div class="col-12">
            <span class="text-grey">Total Area: {{ totalArea }} square meters</span>
          </div>
        </div>
      </div>
    </form-dialog>

    <!-- Delete Confirmation Dialog -->
    <confirmation-dialog v-model="deleteConfirmDialog" :message="deleteConfirmMessage" @confirm="executeDelete"
      @cancel="deleteConfirmDialog = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DataHall } from "src/types/models";
import { dataHallService } from "../../services/dataHallService";
import { customerService } from "../../services/customerService";
import { floorService } from "../../services/floorService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

interface Floor {
  id: number;
  name: string;
}

const TILE_SIZE = 0.6; // 600mm = 0.6m

export default defineComponent({
  name: "DataHallList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const customerName = ref("");
    const dataHalls = ref<DataHall[]>([]);
    const floors = ref<Floor[]>([]);
    const loading = ref(false);
    const dataHallDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingDataHall = ref<DataHall | null>(null);
    const searchTerm = ref("");
    const selectedDataHalls = ref<DataHall[]>([]);
    const deleteConfirmMessage = ref("");
    const deleteMode = ref<"single" | "multiple">("single");
    const singleDeleteId = ref<number | null>(null);

    const dataHallForm = ref({
      name: "",
      floorId: null as number | null,
      tilesLength: 80,
      tilesWidth: 80,
    });

    const lengthInMeters = computed(() => {
      return (dataHallForm.value.tilesLength * TILE_SIZE).toFixed(2);
    });

    const widthInMeters = computed(() => {
      return (dataHallForm.value.tilesWidth * TILE_SIZE).toFixed(2);
    });

    const totalArea = computed(() => {
      return (
        Number(lengthInMeters.value) * Number(widthInMeters.value)
      ).toFixed(2);
    });

    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "name", label: "Name", field: "name", sortable: true },
      {
        name: "floor",
        label: "Floor",
        field: (row: DataHall) => row.floor?.name,
        sortable: true,
      },
      {
        name: "tilesLength",
        label: "Length (tiles)",
        field: "tilesLength",
        sortable: true,
      },
      {
        name: "tilesWidth",
        label: "Width (tiles)",
        field: "tilesWidth",
        sortable: true,
      },
      {
        name: "layout",
        label: "Area (m²)",
        field: (row: DataHall) =>
          (row.tilesLength * row.tilesWidth * TILE_SIZE * TILE_SIZE).toFixed(2),
        sortable: true,
      },
    ];

    const updateLayout = () => {
      // This function is called when either length or width changes
      // The computed properties will automatically update
    };

    const floorOptions = computed(() => {
      return floors.value.map((floor) => ({
        id: floor.id,
        name: floor.name,
        label: `${floor.name}`,
        value: floor.id,
      }));
    });

    const filteredDataHalls = computed(() => {
      return dataHalls.value.filter((dataHall) =>
        dataHall.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const navigateToManagement = (dataHallId: number) => {
      router.push({
        name: "ZoneManagement",
        params: { dataHallId: dataHallId.toString() },
        query: { customerId: route.params.customerId.toString() },
      });
    };

    const fetchDataHalls = async () => {
      loading.value = true;
      try {
        dataHalls.value = await dataHallService.getDataHallsByCustomerId(
          props.customerId
        );
      } catch (error) {
        console.error("Failed to fetch data halls:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCustomerName = async () => {
      try {
        const customer = await customerService.getCustomerById(
          props.customerId
        );
        customerName.value = customer.name;
      } catch (error) {
        console.error("Failed to fetch customer name:", error);
      }
    };

    const fetchFloors = async () => {
      try {
        floors.value = await floorService.getFloorsByCustomerId(
          props.customerId
        );
      } catch (error) {
        console.error("Failed to fetch floors:", error);
      }
    };

    const openAddDataHallDialog = () => {
      editingDataHall.value = null;
      dataHallForm.value = {
        name: "",
        floorId: null,
        tilesLength: 80,
        tilesWidth: 80,
      };
      dataHallDialog.value = true;
    };

    const openEditDataHallDialog = (dataHall: DataHall) => {
      editingDataHall.value = dataHall;
      dataHallForm.value = {
        name: dataHall.name,
        floorId: dataHall.floorId,
        tilesLength: dataHall.tilesLength,
        tilesWidth: dataHall.tilesWidth,
      };
      dataHallDialog.value = true;
    };

    const saveDataHall = async () => {
      if (!dataHallForm.value.floorId) {
        console.error("Floor ID is required.");
        return;
      }

      try {
        const dataHallData = {
          ...dataHallForm.value,
          customerId: Number(props.customerId),
          floorId: dataHallForm.value.floorId,
        };
        if (editingDataHall.value) {
          await dataHallService.updateDataHall(
            editingDataHall.value.id,
            dataHallData
          );
        } else {
          await dataHallService.createDataHall(dataHallData);
        }

        await fetchDataHalls();

        dataHallDialog.value = false;
        emit("datahall-updated");
      } catch (error) {
        console.error("Failed to save data hall:", error);
        alert("An error occurred while saving the data hall.");
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = "single";
      singleDeleteId.value = id;
      deleteConfirmMessage.value =
        "Are you sure you want to delete this data hall?";
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = "multiple";
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedDataHalls.value.length} data hall(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === "single" && singleDeleteId.value !== null) {
        await deleteSingleDataHall(singleDeleteId.value);
      } else if (deleteMode.value === "multiple") {
        await deleteSelectedDataHalls();
      }
    };

    const deleteSingleDataHall = async (id: number) => {
      try {
        await dataHallService.deleteDataHall(id);
        await fetchDataHalls();
        emit("datahall-updated");
      } catch (error) {
        console.error("Failed to delete data hall:", error);
      }
    };

    const deleteSelectedDataHalls = async () => {
      try {
        for (const dataHall of selectedDataHalls.value) {
          await dataHallService.deleteDataHall(dataHall.id);
        }
        await fetchDataHalls();
        selectedDataHalls.value = [];
        emit("datahall-updated");
      } catch (error) {
        console.error("Failed to delete selected data halls:", error);
      }
    };

    onMounted(() => {
      fetchDataHalls();
      fetchCustomerName();
      fetchFloors();
    });

    watch(
      () => props.customerId,
      () => {
        fetchDataHalls();
        fetchCustomerName();
        fetchFloors();
      }
    );

    return {
      customerName,
      dataHalls,
      filteredDataHalls,
      columns,
      loading,
      dataHallDialog,
      deleteConfirmDialog,
      deleteConfirmMessage,
      dataHallForm,
      editingDataHall,
      searchTerm,
      selectedDataHalls,
      floorOptions,
      lengthInMeters,
      widthInMeters,
      totalArea,
      openAddDataHallDialog,
      openEditDataHallDialog,
      saveDataHall,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      navigateToManagement,
      updateLayout,
    };
  },
});
</script>

<style lang="scss" scoped>
.datahall-management {

  .q-input,
  .q-select {
    .q-field__control {
      background: rgba(255, 255, 255, 0.05);
    }

    .q-field__label {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .layout-preview {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 600px) {
    .q-btn {
      &.q-mr-sm {
        margin-top: 12px;
      }
    }
  }
}
</style>
