<template>
  <div
    class="cable-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Cables
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="Cable"
      v-model:search-term="filter"
      :has-selected="selectedCables.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredCables"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedCables"
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
            v-model.trim="form.cableType"
            label="CableType"
            dark
            outlined
            type="string"
            required
            :rules="[(val) => !!val || 'CableType is required']"
            placeholder="Enter name"
          />

          <q-input
            v-model.trim="form.length"
            label="Length"
            dark
            outlined
            type="text"
            required
            :rules="[(val) => !!val || 'length is required']"
            placeholder="Enter length"
        />

          
          <q-select
            v-model="form.gpuComputeRackId"
            :options="gpuComputeRackOptions"
            label="GpuComputeRack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Gpu Compute Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Gpu Compute Rack selected:', val)"
          />

          <q-select
            v-model="form.cpuComputeRackId"
            :options="cpuComputeRackOptions"
            label="CpuComputeRack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'CpuComputeRack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Cpu ComputeRack selected:', val)"
          />

          <q-select
            v-model="form.zoneId"
            :options="zoneOptions"
            label="Zone"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Zone is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Zone selected:', val)"
          />

          <q-select
            v-model="form.leafSwitchRackId"
            :options="leafSwitchRackOptions"
            label="Leaf Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Leaf Switch Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Leaf Switch Rack selected:', val)"
          />

          <q-select
            v-model="form.spineLeafSwitchRackId"
            :options="spineLeafSwitchRackOptions"
            label="Spine Leaf Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Spine Leaf Switch Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Spine Leaf Switch Rack selected:', val)"
          />

          <q-select
            v-model="form.superSpineSwitchRackId"
            :options="superSpineSwitchRackOptions"
            label="Super Spine Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Super Spine Switch Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Super Spine Switch Rack selected:', val)"
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
import { Zone, Cable, LeafSwitchRack, SpineLeafSwitchRack ,SuperSpineSwitchRack, CpuComputeRack, GpuComputeRack } from "src/types/models";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { cableService } from "src/services/cableService";


import { zoneService } from "src/services/zoneService";
import { cpuComputeRackService  } from "src/services/cpuComputeRackService";
import { gpuComputeRackService } from "src/services/gpuComputeRackService";
import { leafSwitchRackService } from "src/services/leafSwitchRackService";
import { spineLeafSwitchRackService } from "src/services/spineLeafSwitchRackService";
import { superSpineSwitchRackService } from "src/services/superSpineSwitchRackService";



export default defineComponent({
  name: "CableManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["cable-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const cables = ref<Cable[]>([]);

    const zone = ref<Zone[]>([]);
    const gpuComputeRack = ref<GpuComputeRack[]>([]);
    const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    const spineLeafSwitchRack = ref<SpineLeafSwitchRack[]>([]);
    const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([]);
    const cpuComputeRack = ref<CpuComputeRack[]>([]);
   


    const filter = ref("");
    const selectedCables = ref<Cable[]>([]);

    const columns = [
  {
    name: "cableType",
    required: true,
    label: "CableType",
    align: "left" as "left",
    field: "cableType",
    sortable: true,
  },
  {
    name: "length",
    required: true,
    label: "length",
    align: "left" as "left",
    field: "length",
    sortable: true,
  },
  {
    name: "gpuComputeRackd",
    required: true,
    label: "Gpu Compute Rack",
    align: "left" as "left",
    field: (row: Cable) =>
      row.gpuComputeRack?.name ||
      gpuComputeRack.value.find((gPR) => gPR.id === row.gpuComputeRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "cpuComputeRackd",
    required: true,
    label: "Cpu Compute Rack",
    align: "left" as "left",
    field: (row: Cable) =>
      row.cpuComputeRack?.name ||
      cpuComputeRack.value.find((cPR) => cPR.id === row.cpuComputeRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "zoneId",
    required: true,
    label: "Zone",
    align: "left" as "left",
    field: (row: Cable) =>
      row.zone?.name || zone.value.find((z) => z.id === row.zoneId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "leafSwitchRackId",
    required: true,
    label: "Leaf Switch Rack",
    align: "left" as "left",
    field: (row: Cable) =>
      row.leafSwitchRack?.name || leafSwitchRack.value.find((lSR) => lSR.id === row.leafSwitchRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "spineLeafSwitchRackId",
    required: true,
    label: "Spine Leaf Switch Rack",
    align: "left" as "left",
    field: (row: Cable) =>
      row.spineLeafSwitchRack?.name || spineLeafSwitchRack.value.find((sLS) => sLS.id === row.spineLeafSwitchRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "superSpineSwitchRackId",
    required: true,
    label: "Super Spine Switch Rack",
    align: "left" as "left",
    field: (row: Cable) =>
      row.superSpineSwitchRack?.name || superSpineSwitchRack.value.find((sSsR) => sSsR.id === row.superSpineSwitchRackId)?.name || "N/A",
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
      cableId: null as number | null,
    });

const form = ref<Partial<Cable>>({})


    const deleteConfirmMessage = computed(() => {
      return selectedCables.value.length > 0
        ? `Are you sure you want to delete ${selectedCables.value.length} cable(s)?`
        : "Are you sure you want to delete this cable?";
    });

    
    const isFormValid = computed(() => {
      return form.value !== undefined;
    });


    const gpuComputeRackOptions = computed(() =>
    gpuComputeRack.value.map((gpuComputeRackMap) => ({
        label: gpuComputeRackMap.name,
        value: gpuComputeRackMap.id,
      }))
    );

    const cpuComputeRackOptions = computed(() =>
    cpuComputeRack.value.map((cpuComputeRackMap) => ({
        label: cpuComputeRackMap.name,
        value: cpuComputeRackMap.id,
      }))
    );

    const zoneOptions = computed(() =>
      zone.value.map((zoneMap) => ({
        label: zoneMap.name,
        value: zoneMap.id,
      }))
    );


    const leafSwitchRackOptions = computed(() =>
      leafSwitchRack.value.map((leafSwitchRackMap) => ({
        label: leafSwitchRackMap.name,
        value: leafSwitchRackMap.id,
      }))
    );

    const spineLeafSwitchRackOptions = computed(() =>
      spineLeafSwitchRack.value.map((spineLeafSwitchRackMap) => ({
        label: spineLeafSwitchRackMap.name,
        value: spineLeafSwitchRackMap.id,
      }))
    );
    
    const superSpineSwitchRackOptions = computed(() =>
      superSpineSwitchRack.value.map((superSpineSwitchRackMap) => ({
        label: superSpineSwitchRackMap.name,
        value: superSpineSwitchRackMap.id,
      }))
    );


    const resetFormData = () => {
  form.value = {
    cableType: "",
    length: "", 
    customerId: undefined, 
    dataHallId: undefined,
    zoneId: undefined, 
    gpuComputeRackId: undefined, 
    cpuComputeRackId: undefined, 
    leafSwitchRackId: undefined, 
    spineLeafSwitchRackId: undefined, 
    superSpineSwitchRackId: undefined 
  };
};


    const filteredCables = computed(() => {
  return cables.value.filter((cable) => {
    const searchTerm = filter.value.trim().toLowerCase();

    // Combine all relevant fields into a single string
    const combinedFields = [
      cable.id.toString().toLowerCase(),
      cable.cableType.toLowerCase(), // Add cableType if needed
      cable.length.toLowerCase(),
      cable.customer.name.toLowerCase(),
      cable.dataHall.name.toLowerCase(),
      cable.zone?.name.toLowerCase() || "",
      cable.gpuComputeRack?.name.toLowerCase() || "",
      cable.cpuComputeRack?.name.toLowerCase() || "",
      cable.leafSwitchRack?.name.toLowerCase() || "",
      cable.spineLeafSwitchRack?.name.toLowerCase() || "",
      cable.superSpineSwitchRack?.name.toLowerCase() || "",
    ].join(" "); // Combine all fields into a single string

    // Check if the combined fields contain the search term
    return combinedFields.includes(searchTerm);
  });
});


    const fetchCables = async () => {
      loading.value = true;
      try {
        cables.value = await cableService.
        getCablesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch cables:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    // Fetching related data for the different entities
    const [
      fetchedCpuComputeRacks,
      fetchedGpuComputeRacks,
      fetchedZones,
      fetchedLeafSwitchRacks,
      fetchedSpineLeafSwitchRacks,
      fetchedSuperSpineSwitchRacks,
    ] = await Promise.all([
      cpuComputeRackService.getCpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      gpuComputeRackService.getGpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      zoneService.getZonesByCustomerAndDataHallId(customerId, dataHallId),
      leafSwitchRackService.getLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      spineLeafSwitchRackService.getSpineLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      superSpineSwitchRackService.getSuperSpineSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedCpuComputeRacks, null, 2));
    console.log('Fetched GpuComuteRacks:', JSON.stringify(fetchedGpuComputeRacks, null, 2));
    console.log('Fetched Zones:', JSON.stringify(fetchedZones, null, 2));
    console.log('Fetched LeafSwitchRacks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));
    console.log('Fetched SpineLeafSwitchRacks:', JSON.stringify(fetchedSpineLeafSwitchRacks, null, 2));
    console.log('Fetched SuperSpineSwitchRacks:', JSON.stringify(fetchedSuperSpineSwitchRacks, null, 2));

    // Storing fetched data in respective reactive variables
    cpuComputeRack.value = fetchedCpuComputeRacks;
    gpuComputeRack.value = fetchedGpuComputeRacks;
    zone.value = fetchedZones;
    leafSwitchRack.value = fetchedLeafSwitchRacks;
    spineLeafSwitchRack.value = fetchedSpineLeafSwitchRacks;
    superSpineSwitchRack.value = fetchedSuperSpineSwitchRacks;

    // Logging the options for debugging
    console.log('CpuComputeRacks Options:', JSON.stringify(cpuComputeRackOptions.value, null, 2));
    console.log('GpuComputeRacks Options:', JSON.stringify(gpuComputeRackOptions.value, null, 2));
    console.log('Zone Options:', JSON.stringify(zoneOptions.value, null, 2));
    console.log('LeafSwitchRack Options:', JSON.stringify(leafSwitchRackOptions.value, null, 2));
    console.log('SpineLeafSwitchRack Options:', JSON.stringify(spineLeafSwitchRackOptions.value, null, 2));
    console.log('SuperSpineSwitchRack Options:', JSON.stringify(superSpineSwitchRackOptions.value, null, 2));

  } catch (error) {
    console.error('Failed to fetch related data:', error);
  }
};


    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Cable",
        mode: "create",
      };
    };

    const openEditDialog = (cable: Cable) => {
      form.value = { ...cable };
      dialog.value = {
        show: true,
        title: "Edit Cable",
        mode: "edit",
      };
      deleteDialog.value.cableId = cable.id;
    };

    const confirmDelete = (cableId: number) => {
      deleteDialog.value = {
        show: true,
        cableId: cableId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    // Validate required fields
    if (!form.value.length?.trim() ||
    !form.value.cpuComputeRackId ||
    !form.value.gpuComputeRackId ||
    !form.value.zoneId ||
    !form.value.leafSwitchRackId ||
    !form.value.spineLeafSwitchRackId ||
    !form.value.superSpineSwitchRackId) {
      console.error('All fields are required');
      return;
    }


    const submitData = {
        cableType: form.value.cableType?.trim(),
        length: form.value.length?.trim(),
        customerId: Number(customerId),
          dataHallId: Number(dataHallId),
        zoneId: Number(form.value.zoneId),
        gpuComputeRackId: Number(form.value.gpuComputeRackId), 
        cpuComputeRackId: Number(form.value.cpuComputeRackId), 
        leafSwitchRackId: Number(form.value.leafSwitchRackId), 
        spineLeafSwitchRackId: Number(form.value.spineLeafSwitchRackId),  
        superSpineSwitchRackId: Number(form.value.superSpineSwitchRackId),
};

console.log('Submit Data:', submitData);  //


    // Check the mode to either create or update the record
    if (dialog.value.mode === "create") {
      await cableService.createCable(submitData);
    } else {
      if (deleteDialog.value.cableId) {
        await cableService.updateCable(deleteDialog.value.cableId, submitData);
      }
    }

    // Close the dialog and fetch updated data
    dialog.value.show = false;
    await fetchCables();
    emit("cable-updated");

  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} cable:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedCables.value.length > 0) {
          for (const cable of selectedCables.value) {
            await cableService.deleteCable(cable.id);
          }
          selectedCables.value = [];
        } else if (deleteDialog.value.cableId) {
          await cableService.deleteCable(deleteDialog.value.cableId);
        }
        await fetchCables();
        emit("cable-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete cable(s):", error);
      }
    };

    onMounted(() => {
      fetchCables();
      fetchRelatedData();
    });


    return {
      loading,
      filteredCables,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,

      zoneOptions,
      cpuComputeRackOptions,
      gpuComputeRackOptions,
      leafSwitchRackOptions,
      spineLeafSwitchRackOptions,
      superSpineSwitchRackOptions,

      selectedCables,
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