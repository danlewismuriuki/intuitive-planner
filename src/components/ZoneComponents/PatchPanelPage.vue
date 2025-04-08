<template>
  <div
    class="patchPanel-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      PatchPanels
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="PatchPanel"
      v-model:search-term="filter"
      :has-selected="selectedPatchPanels.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredPatchPanels"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedPatchPanels"
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
          v-model.trim="form.name"
          label="Name"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name"
        />

        <q-toggle
          v-model="form.patchPanelPresent"
          label="Patch panel present"
          dark
          outlined
          required
        />

        <q-input
          v-model.trim="form.patchPanelTypeFiberOrCopper"
          label="Patchpaneltypefiberorcopper"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'patchPanelTypeFiberOrCopper is required']"
          placeholder="Enter patchpaneltypefiberorcopper"
        />

        <q-input
          v-model.number.trim="form.numberofRusPerPatchPanelType"
          label="Numberofrusperpatchpaneltype"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberofRusPerPatchPanelType is required']"
          placeholder="Enter numberofrusperpatchpaneltype"
        />

        <q-input
          v-model.number.trim="form.numberofPatchPanelPorts"
          label="Numberofpatchpanelports"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberofPatchPanelPorts is required']"
          placeholder="Enter numberofpatchpanelports"
        />

        <q-input
          v-model.number.trim="form.locatedInRUNumber"
          label="Locatedinrunumber"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'locatedInRUNumber is required']"
          placeholder="Enter locatedinrunumber"
        />

        <q-select
            v-model="form.networkCabinetId"
            :options="networkCabinetOptions"
            label="NetworkCabinet"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Network Cabinet is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Network Cabinet selected:', val)"
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
import { PatchPanel } from "src/types/models";
import { patchPanelService } from "../../services/patchPanelService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

import { 
  GpuComputeRack,CpuComputeRack, Zone, LeafSwitchRack, SpineLeafSwitchRack, NetworkCabinet, SuperSpineSwitchRack } from "src/types/models";

  import { networkCabinetService } from "src/services/networkCabinetService";
  import { gpuComputeRackService } from "src/services/gpuComputeRackService";
  import { cpuComputeRackService } from "src/services/cpuComputeRackService";
  import { zoneService } from "src/services/zoneService";
  import { leafSwitchRackService } from "src/services/leafSwitchRackService";
  import { superSpineSwitchRackService } from "src/services/superSpineSwitchRackService";
  import { spineLeafSwitchRackService } from "src/services/spineLeafSwitchRackService";



export default defineComponent({
  name: "PatchPanelManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["patchPanel-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const patchPanels = ref<PatchPanel[]>([]);
    const filter = ref("");
    const selectedPatchPanels = ref<PatchPanel[]>([]);

    const gpuComputeRack = ref<GpuComputeRack[]>([]);
    const cpuComputeRack = ref<CpuComputeRack[]>([]);
    const zone  = ref<Zone[]>([]);
    const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    const spineLeafSwitchRack = ref<SpineLeafSwitchRack[]>([])
    const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([])
    const networkCabinet = ref<NetworkCabinet[]>([])


    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      },{
        name: "patchPanelPresent",
        required: true,
        label: "Patchpanelpresent",
        align: "left" as "left",
        field: "patchPanelPresent",
        sortable: true,
      },{
        name: "patchPanelTypeFiberOrCopper",
        required: true,
        label: "Patchpaneltypefiberorcopper",
        align: "left" as "left",
        field: "patchPanelTypeFiberOrCopper",
        sortable: true,
      },{
        name: "numberofRusPerPatchPanelType",
        required: true,
        label: "Numberofrusperpatchpaneltype",
        align: "left" as "left",
        field: "numberofRusPerPatchPanelType",
        sortable: true,
      },{
        name: "numberofPatchPanelPorts",
        required: true,
        label: "Numberofpatchpanelports",
        align: "left" as "left",
        field: "numberofPatchPanelPorts",
        sortable: true,
      },{
        name: "locatedInRUNumber",
        required: true,
        label: "Locatedinrunumber",
        align: "left" as "left",
        field: "locatedInRUNumber",
        sortable: true,
      },{
        name: "zoneId",
        required: true,
        label: "Zone",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.zone?.name || zone.value.find((z) => z.id === row.zoneId)?.name || "N/A",
        sortable: true,
      },{
        name: "networkCabinetId",
        required: true,
        label: "NetworkCabinet",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.networkCabinet?.name || networkCabinet.value.find((n) => n.id === row.zoneId)?.name || "N/A",
        sortable: true,
      },{
        name: "gpuComputeRackd",
        required: true,
        label: "Gpu Compute Rack",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.gpuComputeRack?.name ||
          gpuComputeRack.value.find((gPR) => gPR.id === row.gpuComputeRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "cpuComputeRackd",
        required: true,
        label: "Cpu Compute Rack",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.cpuComputeRack?.name ||
          cpuComputeRack.value.find((cPR) => cPR.id === row.cpuComputeRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "leafSwitchRackId",
        required: true,
        label: "Leaf Switch Rack",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.leafSwitchRack?.name || leafSwitchRack.value.find((lSR) => lSR.id === row.leafSwitchRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "spineLeafSwitchRackId",
        required: true,
        label: "Spine Leaf Switch Rack",
        align: "left" as "left",
        field: (row: PatchPanel) =>
          row.spineLeafSwitchRack?.name || spineLeafSwitchRack.value.find((sLS) => sLS.id === row.spineLeafSwitchRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "superSpineSwitchRackId",
        required: true,
        label: "Super Spine Switch Rack",
        align: "left" as "left",
        field: (row: PatchPanel) =>
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
      patchPanelId: null as number | null,
    });

    const form = ref<Partial<PatchPanel>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const networkCabinetOptions = computed(() =>
    networkCabinet.value.map((networkCabinetMap) => ({
        label: networkCabinetMap.name,
        value: networkCabinetMap.id,
      }))
    );

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

    const deleteConfirmMessage = computed(() => {
      return selectedPatchPanels.value.length > 0
        ? `Are you sure you want to delete ${selectedPatchPanels.value.length} patchPanel(s)?`
        : "Are you sure you want to delete this patchPanel?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchPatchPanels = async () => {
      loading.value = true;
      try {
        patchPanels.value = await patchPanelService.
        getPatchPanelsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch patchPanels:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    // Fetching related data for the different entities
    const [
      fetchedNetworkCabinet,
      fetchedCpuComputeRacks,
      fetchedGpuComputeRacks,
      fetchedZones,
      fetchedLeafSwitchRacks,
      fetchedSpineLeafSwitchRacks,
      fetchedSuperSpineSwitchRacks,
    ] = await Promise.all([
      networkCabinetService.getNetworkCabinetsByCustomerAndDataHallId(customerId, dataHallId),
      cpuComputeRackService.getCpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      gpuComputeRackService.getGpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      zoneService.getZonesByCustomerAndDataHallId(customerId, dataHallId),
      leafSwitchRackService.getLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      spineLeafSwitchRackService.getSpineLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      superSpineSwitchRackService.getSuperSpineSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedNetworkCabinet, null, 2));
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedCpuComputeRacks, null, 2));
    console.log('Fetched GpuComuteRacks:', JSON.stringify(fetchedGpuComputeRacks, null, 2));
    console.log('Fetched Zones:', JSON.stringify(fetchedZones, null, 2));
    console.log('Fetched LeafSwitchRacks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));
    console.log('Fetched SpineLeafSwitchRacks:', JSON.stringify(fetchedSpineLeafSwitchRacks, null, 2));
    console.log('Fetched SuperSpineSwitchRacks:', JSON.stringify(fetchedSuperSpineSwitchRacks, null, 2));

    // Storing fetched data in respective reactive variables
    networkCabinet.value = fetchedNetworkCabinet;
    cpuComputeRack.value = fetchedCpuComputeRacks;
    gpuComputeRack.value = fetchedGpuComputeRacks;
    zone.value = fetchedZones;
    leafSwitchRack.value = fetchedLeafSwitchRacks;
    spineLeafSwitchRack.value = fetchedSpineLeafSwitchRacks;
    superSpineSwitchRack.value = fetchedSuperSpineSwitchRacks;

    // Logging the options for debugging
    console.log('NetworkCabinet Options:', JSON.stringify(networkCabinetOptions.value, null, 2));
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

    const filteredPatchPanels = computed(() => {
  return patchPanels.value.filter((patchPanel) => {
    const searchTerm = filter.value.trim().toLowerCase();

    // Combine all relevant fields into a single string
    const combinedFields = [
      patchPanel.name.toLowerCase(),
      patchPanel.patchPanelPresent.toString().toLowerCase(),
      patchPanel.patchPanelTypeFiberOrCopper.toLowerCase(),
      patchPanel.numberofRusPerPatchPanelType.toString().toLowerCase(),
      patchPanel.numberofPatchPanelPorts.toString().toLowerCase(),
      patchPanel.locatedInRUNumber.toString().toLowerCase(),
      patchPanel.networkCabinet?.name.toLowerCase() || "",
      patchPanel.zone?.name.toLowerCase() || "",
      patchPanel.gpuComputeRack?.name.toLowerCase() || "",
      patchPanel.cpuComputeRack?.name.toLowerCase() || "",
      patchPanel.leafSwitchRack?.name.toLowerCase() || "",
      patchPanel.spineLeafSwitchRack?.name.toLowerCase() || "",
      patchPanel.superSpineSwitchRack?.name.toLowerCase() || "",
    ].join(" ");

    // Check if the combined fields contain the search term
    return combinedFields.includes(searchTerm);
  });
});


    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New PatchPanel",
        mode: "create",
      };
    };

    const openEditDialog = (patchPanel: PatchPanel) => {
      form.value = { ...patchPanel };
      dialog.value = {
        show: true,
        title: "Edit PatchPanel",
        mode: "edit",
      };
      deleteDialog.value.patchPanelId = patchPanel.id;
    };

    const confirmDelete = (patchPanelId: number) => {
      deleteDialog.value = {
        show: true,
        patchPanelId: patchPanelId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      name: form.value.name,
      patchPanelPresent: form.value.patchPanelPresent,
      patchPanelTypeFiberOrCopper: form.value.patchPanelTypeFiberOrCopper,
      numberofRusPerPatchPanelType: Number(form.value.numberofRusPerPatchPanelType),
      numberofPatchPanelPorts: Number(form.value.numberofPatchPanelPorts),
      locatedInRUNumber: Number(form.value.locatedInRUNumber),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
      networkCabinetId: Number(form.value.networkCabinetId),
      zoneId: Number(form.value.zoneId),
      gpuComputeRackId: Number(form.value.gpuComputeRackId),
      cpuComputeRackId: Number(form.value.cpuComputeRackId),
      leafSwitchRackId: Number(form.value.leafSwitchRackId),
      spineLeafSwitchRackId: Number(form.value.spineLeafSwitchRackId),
      superSpineSwitchRackId: Number(form.value.superSpineSwitchRackId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await patchPanelService.createPatchPanel(submitData);
    } else {
      if (deleteDialog.value.patchPanelId) {
        await patchPanelService.updatePatchPanel(
          deleteDialog.value.patchPanelId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchPatchPanels(); // Fetch updated data
    emit("patchPanel-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} patch panel:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedPatchPanels.value.length > 0) {
          for (const patchPanel of selectedPatchPanels.value) {
            await patchPanelService.deletePatchPanel(patchPanel.id);
          }
          selectedPatchPanels.value = [];
        } else if (deleteDialog.value.patchPanelId) {
          await patchPanelService.deletePatchPanel(deleteDialog.value.patchPanelId);
        }
        await fetchPatchPanels();
        emit("patchPanel-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete patchPanel(s):", error);
      }
    };

    onMounted(() => {
      fetchPatchPanels();
      fetchRelatedData();
    });

    return {
      loading,
      patchPanels,
      filteredPatchPanels,
      gpuComputeRackOptions,
      cpuComputeRackOptions,
      zoneOptions,
      leafSwitchRackOptions,
      spineLeafSwitchRackOptions,
      superSpineSwitchRackOptions,
      networkCabinetOptions,

      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedPatchPanels,
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