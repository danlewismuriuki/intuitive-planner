<template>
  <div
    class="networkType-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      NetworkTypes
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="NetworkType"
      v-model:search-term="filter"
      :has-selected="selectedNetworkTypes.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredNetworkTypes"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedNetworkTypes"
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
import { GpuRearSide, GpuFrontSide, NetworkType } from "src/types/models";
import { networkTypeService } from "../../services/networkTypeService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { gpufrontsideService } from "src/services/gpuFrontSideService";
import { gpuRearSideService } from "src/services/gpuRearSideService";


export default defineComponent({
  name: "NetworkTypeManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["networkType-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const networkTypes = ref<NetworkType[]>([]);
    const gpuFront = ref<GpuFrontSide[]>([]);
    const gpuRear = ref<GpuRearSide[]>([]);
    const filter = ref("");
    const selectedNetworkTypes = ref<NetworkType[]>([]);

    const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left" as "left",
    field: "name",
    sortable: true,
  },
  {
    name: "gpuFrontSideId",
    required: true,
    label: "GPU Front Side",
    align: "left" as "left",
    field: (row: NetworkType) =>
      row.gpuFrontSide?.name ||
      gpuFront.value.find((gpu) => gpu.id === row.gpuFrontSideId)?.name ||
      "N/A",
    sortable: true,
  },
  {
    name: "gpuRearSideId",
    required: true,
    label: "GPU Rear Side",
    align: "left" as "left",
    field: (row: NetworkType) =>
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
      networkTypeId: null as number | null,
    });

    const form = ref<Partial<NetworkType>>({});


    const deleteConfirmMessage = computed(() => {
      return selectedNetworkTypes.value.length > 0
        ? `Are you sure you want to delete ${selectedNetworkTypes.value.length} networkType(s)?`
        : "Are you sure you want to delete this networkType?";
    });

    const isFormValid = computed(() => {
      return !!(form.value.name?.trim() &&
        form.value.gpuFrontSideId &&
        form.value.gpuRearSideId)
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


    const filteredNetworkTypes = computed(() => {
  return networkTypes.value.filter((networkType) => {
    const searchTerm = filter.value.trim().toLowerCase();

    const gpuFrontSideName =
      networkType.gpuFrontSide?.name ||
      gpuFront.value.find((gpu) => gpu.id === networkType.gpuFrontSideId)?.name;
    const gpuRearSideName =
      networkType.gpuRearSide?.name ||
      gpuRear.value.find((gpu) => gpu.id === networkType.gpuRearSideId)?.name;

    const combinedFields = [
      networkType.name.toLowerCase(),
      networkType.id.toString(),
      networkType.customerId.toString(),
      networkType.dataHallId.toString(),
      gpuFrontSideName?.toLowerCase(),
      gpuRearSideName?.toLowerCase(),
    ].join(" ");

    return combinedFields.includes(searchTerm);
  });
});



    const fetchNetworkTypes = async () => {
      loading.value = true;
      try {
        networkTypes.value = await networkTypeService.
        getNetworkTypesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch networkTypes:", error);
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
        title: "Create New NetworkType",
        mode: "create",
      };
    };

    const openEditDialog = (networkType: NetworkType) => {
      form.value = { ...networkType };
      dialog.value = {
        show: true,
        title: "Edit NetworkType",
        mode: "edit",
      };
      deleteDialog.value.networkTypeId = networkType.id;
    };

    const confirmDelete = (networkTypeId: number) => {
      deleteDialog.value = {
        show: true,
        networkTypeId: networkTypeId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (!form.value.name?.trim()) {
          console.error('Name is required');
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
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          gpuFrontSideId: Number(form.value.gpuFrontSideId),
          gpuRearSideId: Number(form.value.gpuRearSideId),
        };

        if (dialog.value.mode === "create") {
          await networkTypeService.createNetworkType(submitData);
        } else {
          if (deleteDialog.value.networkTypeId) {
            await networkTypeService.updateNetworkType(deleteDialog.value.networkTypeId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchNetworkTypes();;
        emit("networkType-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} networkType:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedNetworkTypes.value.length > 0) {
          for (const networkType of selectedNetworkTypes.value) {
            await networkTypeService.deleteNetworkType(networkType.id);
          }
          selectedNetworkTypes.value = [];
        } else if (deleteDialog.value.networkTypeId) {
          await networkTypeService.deleteNetworkType(deleteDialog.value.networkTypeId);
        }
        await fetchNetworkTypes();
        emit("networkType-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete networkType(s):", error);
      }
    };

    onMounted(() => {
      fetchNetworkTypes();
      fetchRelatedData();
    });

    return {
      loading,
      filteredNetworkTypes,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      gpuFrontOptions, 
      gpuRearOptions,
      selectedNetworkTypes,
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