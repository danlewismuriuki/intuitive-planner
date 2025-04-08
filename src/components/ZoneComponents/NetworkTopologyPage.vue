<template>
  <div
    class="networkTopology-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      NetworkTopologys
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="NetworkTopology"
      v-model:search-term="filter"
      :has-selected="selectedNetworkTopologys.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredNetworkTopologies"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedNetworkTopologys"
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
import { GpuRearSide, GpuFrontSide, NetworkTopology } from "src/types/models";
import { networkTopologyService } from "../../services/networkTopologyService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { gpufrontsideService } from "src/services/gpuFrontSideService";
import { gpuRearSideService } from "src/services/gpuRearSideService";


export default defineComponent({
  name: "NetworkTopologyManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["networkTopology-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const networkTopologys = ref<NetworkTopology[]>([]);
    const gpuFront = ref<GpuFrontSide[]>([]);
    const gpuRear = ref<GpuRearSide[]>([]);
    const filter = ref("");
    const selectedNetworkTopologys = ref<NetworkTopology[]>([]);

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
    field: (row: NetworkTopology) =>
      row.gpuFrontSide?.name || gpuFront.value.find((gpu) => gpu.id === row.gpuFrontSideId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "gpuRearSideId",
    required: true,
    label: "GPU Rear Side",
    align: "left" as "left",
    field: (row: NetworkTopology) =>
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
      networkTopologyId: null as number | null,
    });

    const form = ref<Partial<NetworkTopology>>({});


    const deleteConfirmMessage = computed(() => {
      return selectedNetworkTopologys.value.length > 0
        ? `Are you sure you want to delete ${selectedNetworkTopologys.value.length} networkTopology(s)?`
        : "Are you sure you want to delete this networkTopology?";
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


    const filteredNetworkTopologies = computed(() => {
  return networkTopologys.value.filter((networkTopology) => {
    const searchTerm = filter.value.trim().toLowerCase();

    const gpuFrontSideName =
      networkTopology.gpuFrontSide?.name ||
      gpuFront.value.find((gpu) => gpu.id === networkTopology.gpuFrontSideId)?.name;

    const gpuRearSideName =
      networkTopology.gpuRearSide?.name ||
      gpuRear.value.find((gpu) => gpu.id === networkTopology.gpuRearSideId)?.name;

    const combinedFields = [
      networkTopology.name.toLowerCase(),
      networkTopology.id.toString().toLowerCase(),
      networkTopology.customerId.toString().toLowerCase(),
      networkTopology.dataHallId.toString().toLowerCase(),
      gpuFrontSideName?.toLowerCase(),
      gpuRearSideName?.toLowerCase(),
    ].join(" ");

    return combinedFields.includes(searchTerm);
  });
});



    const fetchNetworkTopologys = async () => {
      loading.value = true;
      try {
        networkTopologys.value = await networkTopologyService.
        getNetworkTopologysByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch networkTopologys:", error);
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
        title: "Create New NetworkTopology",
        mode: "create",
      };
    };

    const openEditDialog = (networkTopology: NetworkTopology) => {
      form.value = { ...networkTopology };
      dialog.value = {
        show: true,
        title: "Edit NetworkTopology",
        mode: "edit",
      };
      deleteDialog.value.networkTopologyId = networkTopology.id;
    };

    const confirmDelete = (networkTopologyId: number) => {
      deleteDialog.value = {
        show: true,
        networkTopologyId: networkTopologyId,
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
          await networkTopologyService.createNetworkTopology(submitData);
        } else {
          if (deleteDialog.value.networkTopologyId) {
            await networkTopologyService.updateNetworkTopology(deleteDialog.value.networkTopologyId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchNetworkTopologys();;
        emit("networkTopology-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} networkTopology:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedNetworkTopologys.value.length > 0) {
          for (const networkTopology of selectedNetworkTopologys.value) {
            await networkTopologyService.deleteNetworkTopology(networkTopology.id);
          }
          selectedNetworkTopologys.value = [];
        } else if (deleteDialog.value.networkTopologyId) {
          await networkTopologyService.deleteNetworkTopology(deleteDialog.value.networkTopologyId);
        }
        await fetchNetworkTopologys();
        emit("networkTopology-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete networkTopology(s):", error);
      }
    };

    onMounted(() => {
      fetchNetworkTopologys();
      fetchRelatedData();
    });

    return {
      loading,
      networkTopologys,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      filteredNetworkTopologies,
      gpuFrontOptions, 
      gpuRearOptions,
      selectedNetworkTopologys,
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