<template>
  <div class="network-switch-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Network Switches
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Network Switch" v-model:search-term="filter"
      :has-selected="selectedNetworkSwitches.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredNetworkSwitches"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedNetworkSwitches"
      @edit="openEditDialog"
      @delete="confirmDelete"
      />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          v-model.trim="form.name"
          label="Name"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'Name is required']"
          placeholder="Enter name"
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
          label="GPU Compute Rack"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'GPU Compute Rack is required']"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          @update:model-value="val => console.log('Gpu Compute Rack is selected:', val)"
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
    <ConfirmationDialog v-model="deleteDialog.show" :message="deleteConfirmMessage" confirm-label="DELETE"
      @confirm="handleDelete" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { NetworkSwitch, GpuComputeRack, CpuComputeRack, NetworkCabinet, LeafSwitchRack, SpineLeafSwitchRack, SuperSpineSwitchRack } from "src/types/models";
import { networkSwitchService } from "src/services/networkSwitchService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

import { gpuComputeRackService } from "src/services/gpuComputeRackService";
import { cpuComputeRackService } from "src/services/cpuComputeRackService";
import { networkCabinetService } from "src/services/networkCabinetService";
import { leafSwitchRackService } from "src/services/leafSwitchRackService";
import { spineLeafSwitchRackService } from "src/services/spineLeafSwitchRackService";
import { superSpineSwitchRackService } from "src/services/superSpineSwitchRackService";

export default defineComponent({
  name: "NetworkSwitchList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["network-switch-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const networkSwitches = ref<NetworkSwitch[]>([]);
    const filter = ref("");
    const selectedNetworkSwitches = ref<NetworkSwitch[]>([]);

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
        name: "networkCabinet",
        required: true,
        label: "Network Cabinet",
        align: "left" as "left",
        field: (row: NetworkSwitch) =>
          row.networkCabinet?.name || networkCabinet.value.find((nC) => nC.id === row.networkCabinetId)?.name || "N/A",
        sortable: true,
      },
      {
        name: "gpuComputeRack",
        required: true,
        label: "GPU Compute Rack",
        align: "left" as "left",
        field: (row: NetworkSwitch) =>
          row.gpuComputeRack?.name || gpuComputeRack.value.find((gCR) => gCR.id === row.gpuComputeRackId)?.name || "N/A",
        sortable: true,
      },
      {
        name: "cpuComputeRack",
        required: true,
        label: "CPU Compute Rack",
        align: "left" as "left",
        field: (row: NetworkSwitch) => 
          row.cpuComputeRack?.name || cpuComputeRack.value.find((cCR) => cCR.id === row.cpuComputeRackId)?.name || "N/A",
        sortable: true,
      },
      {
        name: "leafSwitchRackId",
        required: true,
        label: "Leaf Switch Rack",
        align: "left" as "left",
        field: (row: NetworkSwitch) =>
          row.leafSwitchRack?.name || leafSwitchRack.value.find((lSR) => lSR.id === row.leafSwitchRackId)?.name || "N/A",
        sortable: true,
      },
      {
        name: "spineLeafSwitchRackId",
        required: true,
        label: "Spine Leaf Switch Rack",
        align: "left" as "left",
        field: (row: NetworkSwitch) =>
          row.spineLeafSwitchRack?.name || spineLeafSwitchRack.value.find((sLS) => sLS.id === row.spineLeafSwitchRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "superSpineSwitchRackId",
        required: true,
        label: "Super Spine Switch Rack",
        align: "left" as "left",
        field: (row: NetworkSwitch) =>
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
      networkSwitchId: null as number | null,
    });

    const form = ref<Partial<NetworkSwitch>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedNetworkSwitches.value.length > 0
        ? `Are you sure you want to delete ${selectedNetworkSwitches.value.length} network switch(es)?`
        : "Are you sure you want to delete this network switch?";
    });

    const networkCabinet = ref<NetworkCabinet[]>([])
    const gpuComputeRack = ref<GpuComputeRack[]>([]);
    const cpuComputeRack = ref<CpuComputeRack[]>([]);
    const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    const spineLeafSwitchRack = ref<SpineLeafSwitchRack[]>([])
    const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([])


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
    

    const filteredNetworkSwitches = computed(() => {
  if (!filter.value) return networkSwitches.value;
  const searchTerm = filter.value.toLowerCase();

  return networkSwitches.value.filter(networkSwitch =>
    networkSwitch.name.toLowerCase().includes(searchTerm) ||
    networkSwitch.customer?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.dataHall?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.networkCabinet?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.gpuComputeRack?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.cpuComputeRack?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.leafSwitchRack?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.spineLeafSwitchRack?.name?.toLowerCase().includes(searchTerm) ||
    networkSwitch.superSpineSwitchRack?.name?.toLowerCase().includes(searchTerm)
  );
});


    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchNetworkSwitches = async () => {
      loading.value = true;
      try {
        networkSwitches.value = await networkSwitchService.getNetworkSwitchsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch network switches:", error);
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
      fetchedLeafSwitchRacks,
      fetchedSpineLeafSwitchRacks,
      fetchedSuperSpineSwitchRacks,
    ] = await Promise.all([
      networkCabinetService.getNetworkCabinetsByCustomerAndDataHallId(customerId, dataHallId),
      cpuComputeRackService.getCpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      gpuComputeRackService.getGpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      leafSwitchRackService.getLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      spineLeafSwitchRackService.getSpineLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      superSpineSwitchRackService.getSuperSpineSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedNetworkCabinet, null, 2));
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedCpuComputeRacks, null, 2));
    console.log('Fetched GpuComuteRacks:', JSON.stringify(fetchedGpuComputeRacks, null, 2));
    console.log('Fetched LeafSwitchRacks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));
    console.log('Fetched SpineLeafSwitchRacks:', JSON.stringify(fetchedSpineLeafSwitchRacks, null, 2));
    console.log('Fetched SuperSpineSwitchRacks:', JSON.stringify(fetchedSuperSpineSwitchRacks, null, 2));

    // Storing fetched data in respective reactive variables
    networkCabinet.value = fetchedNetworkCabinet;
    cpuComputeRack.value = fetchedCpuComputeRacks;
    gpuComputeRack.value = fetchedGpuComputeRacks;
    leafSwitchRack.value = fetchedLeafSwitchRacks;
    spineLeafSwitchRack.value = fetchedSpineLeafSwitchRacks;
    superSpineSwitchRack.value = fetchedSuperSpineSwitchRacks;

    // Logging the options for debugging
    console.log('NetworkCabinet Options:', JSON.stringify(networkCabinetOptions.value, null, 2));
    console.log('CpuComputeRacks Options:', JSON.stringify(cpuComputeRackOptions.value, null, 2));
    console.log('GpuComputeRacks Options:', JSON.stringify(gpuComputeRackOptions.value, null, 2));
    
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
        title: "Create New Network Switch",
        mode: "create",
      };
    };

    const openEditDialog = (networkSwitch: NetworkSwitch) => {
      form.value = { ...networkSwitch };
      dialog.value = {
        show: true,
        title: "Edit Network Switch",
        mode: "edit",
      };
      deleteDialog.value.networkSwitchId = networkSwitch.id;
    };

    const confirmDelete = (networkSwitchId: number) => {
      deleteDialog.value = {
        show: true,
        networkSwitchId: networkSwitchId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          name: form.value.name,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),

          networkCabinetId: Number(form.value.networkCabinetId),
          gpuComputeRackId: Number(form.value.gpuComputeRackId),
          cpuComputeRackId: Number(form.value.cpuComputeRackId),
          leafSwitchRackId: Number(form.value.leafSwitchRackId),
          spineLeafSwitchRackId: Number(form.value.spineLeafSwitchRackId),
          superSpineSwitchRackId: Number(form.value.superSpineSwitchRackId),
        };

        if (dialog.value.mode === "create") {
          await networkSwitchService.createNetworkSwitch(submitData);
        } else {
          if (deleteDialog.value.networkSwitchId) {
            await networkSwitchService.updateNetworkSwitch(deleteDialog.value.networkSwitchId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchNetworkSwitches();
        emit("network-switch-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} network switch:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedNetworkSwitches.value.length > 0) {
          for (const networkSwitch of selectedNetworkSwitches.value) {
            await networkSwitchService.deleteNetworkSwitch(networkSwitch.id);
          }
          selectedNetworkSwitches.value = [];
        } else if (deleteDialog.value.networkSwitchId) {
          await networkSwitchService.deleteNetworkSwitch(deleteDialog.value.networkSwitchId);
        }
        await fetchNetworkSwitches();
        emit("network-switch-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete network switch(es):", error);
      }
    };

    onMounted(() => {
      fetchNetworkSwitches();
      fetchRelatedData();
    });

    return {
      loading,
      networkSwitches,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedNetworkSwitches,
      deleteConfirmMessage,
      isFormValid,
      networkCabinetOptions,
      gpuComputeRackOptions,
      cpuComputeRackOptions,
      leafSwitchRackOptions,
      spineLeafSwitchRackOptions,
      superSpineSwitchRackOptions,
      filteredNetworkSwitches,
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
