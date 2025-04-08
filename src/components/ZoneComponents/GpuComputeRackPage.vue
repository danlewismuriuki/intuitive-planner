<template>
  <div
    class="cpu-compute-rack-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      GPU Compute Racks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="GPU Compute Rack"
      v-model:search-term="filter"
      :has-selected="selectedGpuComputeRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredGpuComputeRacks"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedGpuComputeRacks"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <!-- Form Dialog Component -->
    <FormDialog
      v-model="dialog.show"
      :title="dialog.title"
      :is-valid="isFormValid"
      @save="handleSubmit"
      @cancel="dialog.show = false"
    >
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          type="text"
          label="Name"
          dark
          outlined
          required
          :rules="[(val) => val && val.length > 0 || 'Name is required']"
        />

        <q-input
          v-model.number="form.numberOfServersPerRack"
          type="number"
          label="Number of Servers Per Rack"
          dark
          outlined
          required
          :rules="[(val) => val > 0 || 'Must be greater than 0']"
        />

        <q-input
          v-model.number="form.powerLimitPerGpuComputeRack"
          type="number"
          label="Power Limit Per Gpu Rack"
          dark
          outlined
          required
          :rules="[(val) => val > 0 || 'Must be greater than 0']"
        />
        <q-toggle
          v-model="form.containsFiberPatchPanel"
          label="Contains Fiber Patch Panel"
          dark
        />

        <q-toggle
          v-model="form.containsCopperPatchPanel"
          label="Contains Copper Patch Panel"
          dark
        />

        <q-input
          v-model.number="form.numberOfFiberPatchPanels"
          type="number"
          label="Number of Fiber Patch Panels"
          dark
          outlined
          required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
        />

        <q-input
          v-model.number="form.numberOfCopperPatchPanels"
          type="number"
          label="Number of Copper Patch Panels"
          dark
          outlined
          required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
        />

        <q-toggle
          v-model="form.powerFeedActive"
          label="Power Feed Active"
          dark
        />

        <q-toggle
          v-model="form.temperatureFeedActive"
          label="Temperature Feed Active"
          dark
        />

        <q-toggle
          v-model="form.waterLeakDetectionActive"
          label="Water Leak Detection Active"
          dark
        />

        <q-toggle
          v-model="form.doorAccessSensorActive"
          label="Door Access Sensor Active"
          dark
        />

        <q-select
          v-model="form.rackId"
          :options="rackOptions"
          label="Rack"
          dark outlined required
          :rules="[(val) => !!val || 'Rack is required']" option-value="value"
          option-label="label" emit-value
          map-options @update:model-value="val => console.log('Rack selected:', val)" />
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
import { Rack, GpuComputeRack } from "src/types/models";
import { gpuComputeRackService} from "src/services/gpuComputeRackService";
import { rackService } from "src/services/rackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "cpuComputeList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["rack-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);

    const gpuComputeRacks = ref<GpuComputeRack[]>([]);
    const racks = ref<Rack[]>([]);
    
    const filter = ref("");
    const selectedGpuComputeRacks = ref<GpuComputeRack[]>([]);

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
        name: "numberOfServersPerRack",
        required: true,
        label: "Number of Servers Per Rack",
        align: "left" as "left",
        field: "numberOfServersPerRack",
        sortable: true,
      },
      {
        name: "powerLimitPerGpuComputeRack",
        required: true,
        label: "Power Limit per GpuRack",
        align: "left" as "left",
        field: "powerLimitPerGpuComputeRack",
        sortable: true,
      },
      {
        name: "containsFiberPatchPanel",
        required: true,
        label: "Fiber Panel",
        align: "left" as "left",
        field: (row: GpuComputeRack) =>
          row.containsFiberPatchPanel,
        sortable: true,
      },
      {
        name: "containsCopperPatchPanel",
        required: true,
        label: "Copper Panel",
        align: "left" as "left",
        field: (row: GpuComputeRack) =>
          row.containsCopperPatchPanel,
        sortable: true,
      },
      {
        name: "numberOfFiberPatchPanels",
        required: true,
        label: "Number of Fiber Patch Panels",
        align: "left" as "left",
        field: "numberOfFiberPatchPanels",
        sortable: true,
      },
      {
        name: "numberOfCopperPatchPanels",
        required: true,
        label: "Number of Copper Patch Panels",
        align: "left" as "left",
        field: "numberOfCopperPatchPanels",
        sortable: true,
      },
      {
        name: "powerFeedActive",
        required: true,
        label: "Power Feed Active",
        align: "left" as "left",
        field: (row: GpuComputeRack) => row.powerFeedActive,
        sortable: true,
      },
      {
        name: "temperatureFeedActive",
        required: true,
        label: "Temperature Feed Active",
        align: "left" as "left",
        field: (row: GpuComputeRack) => row.temperatureFeedActive,
        sortable: true,
      },
      {
        name: "waterLeakDetectionActive",
        required: true,
        label: "Water Leak Detection Active",
        align: "left" as "left",
        field: (row: GpuComputeRack) => row.waterLeakDetectionActive,
        sortable: true,
      },
      {
        name: "doorAccessSensorActive",
        required: true,
        label: "Door Access Sensor Active",
        align: "left" as "left",
        field: (row: GpuComputeRack) =>
        row.doorAccessSensorActive,
        sortable: true,
      },
      {
        name: "rackId",
        label: "Rack Name",
        align: "left",
        field: (row: GpuComputeRack) => {
          const rack = racks.value.find(r => r.id === row.rackId);
          return rack ? rack.name : 'N/A';
        },
        sortable: true
      }
    ];

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      rackId: null as number | null,
    });

    const form = ref<Partial<GpuComputeRack>>({});

    const isFormValid = computed(() => {
      return !!(
        form.value.powerLimitPerGpuComputeRack &&
        form.value.rackId
      );
    });

    const deleteConfirmMessage = computed(() => {
      return selectedGpuComputeRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedGpuComputeRacks.value.length} rack(s)?`
        : "Are you sure you want to delete this rack?";
    });

    const rackOptions = computed(() =>
      racks.value.map((rack) => ({
        label: rack.name,
        value: rack.id,
      }))
    );

    const resetFormData = () => {
      form.value = {
        name: '',
        customerId: customerId,
        dataHallId: dataHallId,
        rackId: null,
      };
    };

    const fetchGpuComputeRacks = async () => {
      loading.value = true;
      try {
        gpuComputeRacks.value = await gpuComputeRackService.
        getGpuComputeRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch racks:", error);
      } finally {
        loading.value = false;
      }
    };

    const filteredGpuComputeRacks = computed(() => {
  return gpuComputeRacks.value.filter(rack => {
    const searchTerm = filter.value.trim().toLowerCase();
    const rackOption = rackOptions.value.find(option => option.value === rack.rackId);
    const rackName = rackOption ? rackOption.label : undefined; // Get the label (rack name)


    // Combine all fields into a single string for searching
    const combinedFields = [
      rackName?.toLowerCase(),
      rack.name.toString().toLowerCase(),
      rack.id?.toString().toLowerCase(),
      rack.numberOfServersPerRack?.toString().toLowerCase(),
      rack.powerLimitPerGpuComputeRack?.toString().toLowerCase(),
      rack.containsFiberPatchPanel?.toString().toLowerCase(),
      rack.containsCopperPatchPanel?.toString().toLowerCase(),
      rack.numberOfFiberPatchPanels?.toString().toLowerCase(),
      rack.numberOfCopperPatchPanels?.toString().toLowerCase(),
      rack.powerFeedActive?.toString().toLowerCase(),
      rack.temperatureFeedActive?.toString().toLowerCase(),
      rack.waterLeakDetectionActive?.toString().toLowerCase(),
      rack.doorAccessSensorActive?.toString().toLowerCase(),
      rack.customerId?.toString().toLowerCase(),
      rack.dataHallId?.toString().toLowerCase(),
      rack.rackId?.toString().toLowerCase(),
    ].join(' ');

    return combinedFields.includes(searchTerm);
  });
});


    const fetchRelatedData = async () => {
      try {
        console.log('Fetching related data...');
        const [fetchedRacks] = await Promise.all([
          rackService.getAllRacks(),
        ]);

        console.log('Fetched Racks:', JSON.stringify(fetchedRacks, null, 2));
        racks.value = fetchedRacks;
        console.log('Rack Options:', JSON.stringify(rackOptions.value, null, 2));
      } catch (error) {
        console.error("Failed to fetch related data:", error);
      }
    };
   
    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Rack",
        mode: "create",
      };
    };

    const openEditDialog = (rack: Rack) => {
      form.value = { ...rack };
      dialog.value = {
        show: true,
        title: "Edit Rack",
        mode: "edit",
      };
      deleteDialog.value.rackId = rack.id;
    };

    const confirmDelete = (rackId: number) => {
      deleteDialog.value = {
        show: true,
        rackId: rackId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (!form.value.rackId) {
          console.error('Rack ID is required')
          console.log('Form values:', form.value);
          console.error('All fields are required:', {
            rackId: form.value.rackId
          });
          return;
        }
        const submitData = {
          name: form.value.name?.trim() || '', 
          containsFiberPatchPanel: form.value.containsFiberPatchPanel ?? false,
          containsCopperPatchPanel: form.value.containsCopperPatchPanel ?? false,
          numberOfFiberPatchPanels: form.value.numberOfFiberPatchPanels ?? 0,
          numberOfCopperPatchPanels: form.value.numberOfCopperPatchPanels ?? 0,
          numberOfServersPerRack: form.value.numberOfServersPerRack ?? 0,
          powerLimitPerGpuComputeRack: form.value.powerLimitPerGpuComputeRack ?? 0,
          powerFeedActive: form.value.powerFeedActive ?? false,
          temperatureFeedActive: form.value.temperatureFeedActive ?? false,
          waterLeakDetectionActive: form.value.waterLeakDetectionActive ?? false,
          doorAccessSensorActive: form.value.doorAccessSensorActive ?? false,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          rackId: Number(form.value.rackId),
        };
        // To delete
        console.log(submitData);


        if (dialog.value.mode === "create") {
          await gpuComputeRackService.createGpuComputeRack(submitData);
        } else {
          if (deleteDialog.value.rackId) {
            await gpuComputeRackService.updateGpuComputeRack(deleteDialog.value.rackId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchGpuComputeRacks();
        emit("rack-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} rack:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedGpuComputeRacks.value.length > 0) {
          for (const rack of selectedGpuComputeRacks.value) {
            await gpuComputeRackService.deleteGpuComputeRack(rack.id);
          }
          selectedGpuComputeRacks.value = [];
        } else if (deleteDialog.value.rackId) {
          await gpuComputeRackService.deleteGpuComputeRack(deleteDialog.value.rackId);
        }
        await fetchGpuComputeRacks();
        emit("rack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete rack(s):", error);
      }
    };

    onMounted(() => {
      fetchGpuComputeRacks();
      fetchRelatedData();
    });

    return {
      loading,
      racks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedGpuComputeRacks,
      deleteConfirmMessage,
      isFormValid,
      rackOptions,
      gpuComputeRacks,
      filteredGpuComputeRacks,
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