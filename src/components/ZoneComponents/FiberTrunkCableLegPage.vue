<template>
  <div
    class="fiberTrunkCableLeg-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      FiberTrunkCableLegs
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="FiberTrunkCableLeg"
      v-model:search-term="filter"
      :has-selected="selectedFiberTrunkCableLegs.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredFiberTrunkCables"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedFiberTrunkCableLegs"
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
          v-model.trim="form.nameAside"
          label="Name of Side A"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'Name aside is required']"
          placeholder="Enter name aside"
        />

        <q-input
          v-model.trim="form.nameBside"
          label="Name of Side B"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'Name Bside is required']"
          placeholder="Enter name Bside"
        />      

      <!-- Dropdown for PatchPanelModulePort -->

      <q-select
            v-model="form.fiberTrunkCableId"
            :options="fiberTrunkCableOptions"
            label="Select Fiber Trunk Cable"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Fiber Trunk Cable is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Fiber Trunk Cable selected:', val)"
          />

      <q-select
            v-model="form.patchPanelModulePortId"
            :options="patchPanelModulePortOptions"
            label="PatchPanelModulePort"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'patchPanelModulePort is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('patchPanelModulePort selected:', val)"
          />


        <q-toggle
          v-model="form.sideAInstalledOnLeft"
          label="Side A Installed on Left"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.sideBInstalledOnLeft"
          label="Side B Installed on Left"
          dark
          outlined
          required
        />
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
import { FiberTrunkCableLeg, FiberTrunkCable, PatchPanelModulePort } from "src/types/models";
import { fiberTrunkCableLegService } from "../../services/fiberTrunkCableLegService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

import { patchPanelModulePortService } from "src/services/patchPanelModulePortService";
import { fiberTrunkCableService } from "src/services/fiberTrunkCableService";

export default defineComponent({
  name: "FiberTrunkCableLegManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["fiberTrunkCableLeg-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const fiberTrunkCableLegs = ref<FiberTrunkCableLeg[]>([]);
    const filter = ref("");
    const selectedFiberTrunkCableLegs = ref<FiberTrunkCableLeg[]>([]);
    

    const fiberTrunkCable = ref<FiberTrunkCable[]>([]);
    const patchPanelModulePort = ref<PatchPanelModulePort[]>([]); 

    const columns = [
      {
        name: "nameAside",
        required: true,
        label: "Name of Side A",
        align: "left" as "left",
        field: "nameAside",
        sortable: true,
      },
      {
        name: "nameBside",
        required: true,
        label: "Name of Side B",
        align: "left" as "left",
        field: "nameBside",
        sortable: true,
      },
      {
        name: "sideAInstalledOnLeft",
        required: true,
        label: "Side A Installed on Left",
        align: "left" as "left",
        field: "sideAInstalledOnLeft",
        sortable: true,
      },
      {
        name: "sideBInstalledOnLeft",
        required: true,
        label: "Side B Installed on Left",
        align: "left" as "left",
        field: "sideBInstalledOnLeft",
        sortable: true,
      },
      {
        name: "fiberTrunkCableId",
        required: true,
        label: "fiberTrunkCable",
        align: "left" as "left",
        field: (row: FiberTrunkCableLeg) =>
          row.fiberTrunkCable?.name || fiberTrunkCable.value.find((pPMP) => pPMP.id === row.fiberTrunkCableId)?.name || "N/A",
        sortable: true,
      },
      {
        name: "patchPanelModulePortId",
        required: true,
        label: "PatchPanelModulePortId",
        align: "left" as "left",
        field: (row: FiberTrunkCableLeg) =>
          row.patchPanelModulePort?.portLocationFrontOrBack || patchPanelModulePort.value.find((pPMP) => pPMP.id === row.patchPanelModulePortId)?.portLocationFrontOrBack || "N/A",
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
      fiberTrunkCableLegId: null as number | null,
    });

    const form = ref<Partial<FiberTrunkCableLeg>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedFiberTrunkCableLegs.value.length > 0
        ? `Are you sure you want to delete ${selectedFiberTrunkCableLegs.value.length} fiberTrunkCableLeg(s)?`
        : "Are you sure you want to delete this fiberTrunkCableLeg?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const patchPanelModulePortOptions = computed(() =>
    patchPanelModulePort.value.map((patchPanelModulePortMap) => ({
        label: patchPanelModulePortMap.portLocationFrontOrBack,
        value: patchPanelModulePortMap.id,
      }))
    );

    const fiberTrunkCableOptions = computed(() =>
    fiberTrunkCable.value.map((fiberTrunkCableMap) => ({
        label: fiberTrunkCableMap.name,
        value: fiberTrunkCableMap.id,
      }))
    );

    const fetchFiberTrunkCableLegs = async () => {
      loading.value = true;
      try {
        fiberTrunkCableLegs.value = await fiberTrunkCableLegService.
        getFiberTrunkCableLegsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch fiberTrunkCableLegs:", error);
      } finally {
        loading.value = false;
      }
    };

    const filteredFiberTrunkCables = computed(() => {
  // Use `.filter` to iterate through the `fiberTrunkCables` array.
  return fiberTrunkCableLegs.value.filter((fiberTrunkCableLeg) => {
    const searchTerm = filter.value.trim().toLowerCase();

    // Combine all relevant fields into a single string for searching
    const combinedFields = [


      fiberTrunkCableLeg.nameAside.toLocaleLowerCase(),
      fiberTrunkCableLeg.nameBside.toLocaleLowerCase(),
      fiberTrunkCableLeg.sideBInstalledOnLeft.toString(),
      fiberTrunkCableLeg.sideAInstalledOnLeft.toString(),

      fiberTrunkCableLeg.fiberTrunkCable?.name?.toLowerCase() || "",
      fiberTrunkCableLeg.patchPanelModulePort?.portLocationFrontOrBack?.toLowerCase() || ""   
    ]
      .join(' ')
      .toLowerCase();

    // Check if the searchTerm exists in the combinedFields
    return combinedFields.includes(searchTerm);
  });
});


    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    // Fetching related data for the different entities
    const [
      fetchedFiberTrunkCable,
      fetchedPatchPanelModulePort,

    ] = await Promise.all([
      fiberTrunkCableService.getFiberTrunkCablesByCustomerAndDataHallId(customerId, dataHallId),
      patchPanelModulePortService.getPatchPanelModulePortsByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched fiberTrunkCable:', JSON.stringify(fetchedFiberTrunkCable, null, 2));
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedPatchPanelModulePort, null, 2));


    // Storing fetched data in respective reactive variables
    fiberTrunkCable.value = fetchedFiberTrunkCable;
    patchPanelModulePort.value = fetchedPatchPanelModulePort;

    // Logging the options for debugging
    console.log('NetworkCabinet Options:', JSON.stringify(fiberTrunkCableOptions.value, null, 2));
    console.log('patchpanelModulePortOptions Options:', JSON.stringify(patchPanelModulePortOptions.value, null, 2));

  } catch (error) {
    console.error('Failed to fetch related data:', error);
  }
};
    

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New FiberTrunkCableLeg",
        mode: "create",
      };
    };

    const openEditDialog = (fiberTrunkCableLeg: FiberTrunkCableLeg) => {
      form.value = { ...fiberTrunkCableLeg };
      dialog.value = {
        show: true,
        title: "Edit FiberTrunkCableLeg",
        mode: "edit",
      };
      deleteDialog.value.fiberTrunkCableLegId = fiberTrunkCableLeg.id;
    };

    const confirmDelete = (fiberTrunkCableLegId: number) => {
      deleteDialog.value = {
        show: true,
        fiberTrunkCableLegId: fiberTrunkCableLegId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          nameAside: form.value.nameAside,
          nameBside: form.value.nameBside,
          sideAInstalledOnLeft: form.value.sideAInstalledOnLeft,
          sideBInstalledOnLeft: form.value.sideBInstalledOnLeft,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          fiberTrunkCableId: Number(form.value.fiberTrunkCableId),
          patchPanelModulePortId: Number(form.value.patchPanelModulePortId),
        };

        // Handle create or update based on the mode
        if (dialog.value.mode === "create") {
          await fiberTrunkCableLegService.createFiberTrunkCableLeg(submitData);
        } else {
          if (deleteDialog.value.fiberTrunkCableLegId) {
            await fiberTrunkCableLegService.updateFiberTrunkCableLeg(
              deleteDialog.value.fiberTrunkCableLegId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchFiberTrunkCableLegs();  // Fetch updated data
        emit("fiberTrunkCableLeg-updated");  // Emit update event
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} fiber trunk cable leg:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedFiberTrunkCableLegs.value.length > 0) {
          for (const fiberTrunkCableLeg of selectedFiberTrunkCableLegs.value) {
            await fiberTrunkCableLegService.deleteFiberTrunkCableLeg(fiberTrunkCableLeg.id);
          }
          selectedFiberTrunkCableLegs.value = [];
        } else if (deleteDialog.value.fiberTrunkCableLegId) {
          await fiberTrunkCableLegService.deleteFiberTrunkCableLeg(deleteDialog.value.fiberTrunkCableLegId);
        }
        await fetchFiberTrunkCableLegs();
        emit("fiberTrunkCableLeg-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete fiberTrunkCableLeg(s):", error);
      }
    };

    onMounted(() => {
      fetchFiberTrunkCableLegs();
      fetchRelatedData();
    });

    return {
      loading,
      fiberTrunkCableLegs,
      filteredFiberTrunkCables,
      fiberTrunkCableOptions,
      patchPanelModulePortOptions,
      fetchFiberTrunkCableLegs,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedFiberTrunkCableLegs,
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
