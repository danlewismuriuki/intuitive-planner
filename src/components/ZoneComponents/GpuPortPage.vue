<template>
  <div
    class="gpuPort-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      GpuPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="GpuPort"
      v-model:search-term="filter"
      :has-selected="selectedGpuPorts.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredGpuPorts"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedGpuPorts"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <!-- Form Dialog Component -->
    <FormDialog
      v-model="dialog.show"
      :title="dialog.title"
      :is-valid="isFormValid"
      @save="handleSubmit"
      @cancel="dialog.show = false">

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        
        <q-input
          v-model.trim="form.name"
          label="Name"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name"
        />

        <q-input
          v-model.trim="form.location"
          label="location"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'location is required']"
          placeholder="Enter location"
        />

        <q-select
          v-model="form.gpuFrontSideId" 
          :options="gpuFrontOptions"
          label="GpuFrontSide"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'GpuFrontSide is required']"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          @update:model-value="val => console.log('GpuFrontSide selected:', val)" />

        <q-select
          v-model="form.gpuRearSideId"
          :options="gpuRearOptions"
          label="GpuRearSide"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'GpuRearSide is required']"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          @update:model-value="val => console.log('GpuRearSide selected:', val)" />

      </q-form>
    </FormDialog>

    <!-- Confirmation Dialog Component -->
    <ConfirmationDialog
      v-model="deleteDialog.show"
      :message="deleteConfirmMessage"
      confirm-label="DELETE"
      @confirm="handleDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { GpuRearSide, GpuFrontSide, GpuPort } from "src/types/models";
import { gpuPortService } from "../../services/gpuPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { gpufrontsideService } from "src/services/gpuFrontSideService";
import { gpuRearSideService } from "src/services/gpuRearSideService";


export default defineComponent({
  name: "GpuPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["gpuPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const gpuPorts = ref<GpuPort[]>([]);
    const gpuFront = ref<GpuFrontSide[]>([]);
    const gpuRear = ref<GpuRearSide[]>([]);
    const filter = ref("");
    const selectedGpuPorts = ref<GpuPort[]>([]);

    const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left" as "left",
    field: "name",
    sortable: true,
  },{
    name: "location",
    required: true,
    label: "location",
    align: "left" as "left",
    field: "location",
    sortable: true,
  },
  {
    name: "gpuFrontSideId",
    required: true,
    label: "GPU Front Side",
    align: "left" as "left",
    field: (row: GpuPort) =>
      row.gpuFrontSide?.name || gpuFront.value.find((gpu) => gpu.id === row.gpuFrontSideId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "gpuRearSideId",
    required: true,
    label: "GPU Rear Side",
    align: "left" as "left",
    field: (row: GpuPort) =>
      row.gpuRearSide?.name || gpuRear.value.find((gpu) => gpu.id === row.gpuRearSideId)?.name || "N/A",
    sortable: true,
  },
];

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      gpuPortId: null as number | null,
    });

    const form = ref<Partial<GpuPort>>({});


    const deleteConfirmMessage = computed(() => {
      return selectedGpuPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedGpuPorts.value.length} gpuPort(s)?`
        : "Are you sure you want to delete this gpuPort?";
    });

    const isFormValid = computed(() => {
      return !!(
        form.value.name?.trim() &&
        form.value.location &&
        form.value.gpuFrontSideId &&
        form.value.gpuRearSideId
      )
    });

    const gpuFrontOptions = computed(() =>
      gpuFront.value.map((gpuFront) => ({
        label: gpuFront.name,
        value: gpuFront.id,
      }))
    );

    const gpuRearOptions = computed(() =>
      gpuRear.value.map((gpuRear) => ({
        label: gpuRear.name,
        value: gpuRear.id,
      }))
    );

    const resetFormData = () => {
      form.value = {
        name: '',
        customerId: customerId,
        dataHallId: dataHallId,
        gpuFrontSideId: null,
        gpuRearSideId: null,
      };
    };


    const filteredGpuPorts = computed(() => {
  return gpuPorts.value.filter((gpuPort) => {
    const searchTerm = filter.value.trim().toLowerCase();

    const gpuFrontSideName =
      gpuPort.gpuFrontSide?.name ||
      gpuFront.value.find((gpu) => gpu.id === gpuPort.gpuFrontSideId)?.name;

    const gpuRearSideName =
      gpuPort.gpuRearSide?.name ||
      gpuRear.value.find((gpu) => gpu.id === gpuPort.gpuRearSideId)?.name;

    const combinedFields = [
      gpuPort.name.toLowerCase(),
      gpuPort.id.toString().toLowerCase(),
      gpuPort.customerId.toString().toLowerCase(),
      gpuPort.dataHallId.toString().toLowerCase(),
      gpuFrontSideName?.toLowerCase(),
      gpuRearSideName?.toLowerCase(),
    ].join(" ");

    return combinedFields.includes(searchTerm);
  });
});



    const fetchGpuPorts = async () => {
      loading.value = true;
      try {
        gpuPorts.value = await gpuPortService.
        getGpuPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch gpuPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
      try {
        console.log('Fetching related data...');
        const [fetchedgpuFrontSide, fetchedgpuRearSide] = await Promise.all([
          gpufrontsideService.getGpuFrontSidesByCustomerAndDataHallId(customerId, dataHallId),
          gpuRearSideService.getGpuRearSidesByCustomerAndDataHallId(customerId, dataHallId),
        ]);

        console.log('Fetched RackTypes:', JSON.stringify(fetchedgpuFrontSide, null, 2));
        console.log('Fetched Zones:', JSON.stringify(fetchedgpuRearSide, null, 2));

        gpuFront.value = fetchedgpuFrontSide;
        gpuRear.value = fetchedgpuRearSide;

        console.log('gpuFront Options:', JSON.stringify(gpuFrontOptions.value, null, 2));
        console.log('gpuRear Options:', JSON.stringify(gpuRearOptions.value, null, 2));

      } catch (error) {
        console.error("Failed to fetch related data:", error);
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New GpuPort",
        mode: "create",
      };
    };

    const openEditDialog = (gpuPort: GpuPort) => {
      form.value = { ...gpuPort };
      dialog.value = {
        show: true,
        title: "Edit GpuPort",
        mode: "edit",
      };
      deleteDialog.value.gpuPortId = gpuPort.id;
    };

    const confirmDelete = (gpuPortId: number) => {
      deleteDialog.value = {
        show: true,
        gpuPortId: gpuPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (!form.value.name?.trim() || !form.value.location?.trim()) {
          console.error('Name and location is required');
          return;
        }

        if (!form.value.gpuFrontSideId || !form.value.gpuRearSideId) {
          console.log('Form values:', form.value);
          console.error('All fields are required:', {
            gpuFrontSideId: form.value.gpuFrontSideId,
            gpuRearSideId: form.value.gpuRearSideId,
          });
          return;
        }

        const submitData = {
          name: form.value.name.trim(),
          location: form.value.location.trim(),
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          gpuFrontSideId: Number(form.value.gpuFrontSideId),
          gpuRearSideId: Number(form.value.gpuRearSideId),
        };

        if (dialog.value.mode === "create") {
          await gpuPortService.createGpuPort(submitData);
        } else {
          if (deleteDialog.value.gpuPortId) {
            await gpuPortService.updateGpuPort(deleteDialog.value.gpuPortId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchGpuPorts();;
        emit("gpuPort-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} gpuPort:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedGpuPorts.value.length > 0) {
          for (const gpuPort of selectedGpuPorts.value) {
            await gpuPortService.deleteGpuPort(gpuPort.id);
          }
          selectedGpuPorts.value = [];
        } else if (deleteDialog.value.gpuPortId) {
          await gpuPortService.deleteGpuPort(deleteDialog.value.gpuPortId);
        }
        await fetchGpuPorts();
        emit("gpuPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete gpuPort(s):", error);
      }
    };

    onMounted(() => {
      fetchGpuPorts();
      fetchRelatedData();
    });

    return {
      loading,
      filteredGpuPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      gpuFrontOptions, 
      gpuRearOptions,
      selectedGpuPorts,
      deleteConfirmMessage,
      isFormValid,
      openCreateDialog,
      openEditDialog,
      confirmDelete,
      confirmDeleteSelected,
      handleSubmit,
      handleDelete,
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

.q-btn[color="orange"] {
  background: #ff6b2c !important;
}

.q-toolbar-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
}

.q-table {
  margin-top: 1rem;
}
</style>