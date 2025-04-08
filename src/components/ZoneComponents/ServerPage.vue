<template>
  <div class="server-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Servers
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Server" v-model:search-term="filter" :has-selected="selectedServers.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredServers" :columns="columns" :loading="loading" v-model:selected="selectedServers"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit"
        class="q-gutter-md">

         <!-- Server Name Input -->
    <q-input
      v-model.trim="form.name"
      label="Name"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Name is required']"
      placeholder="Enter server name"
    />

    <!-- Device Model Name Input -->
    <q-input
      v-model.trim="form.deviceModelName"
      label="Device Model Name"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Device model name is required']"
      placeholder="Enter device model name"
    />

    <!-- Device Hostname Input -->
    <q-input
      v-model.trim="form.deviceHostName"
      label="Device Hostname"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Device hostname is required']"
      placeholder="Enter device hostname"
    />

    <!-- Device Hostname Number Range -->
    <q-input
      v-model.number="form.deviceHostNameNumberStart"
      type="number"
      label="Device Hostname Number Start"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />
    <q-input
      v-model.number="form.deviceHostNameNumberEnd"
      type="number"
      label="Device Hostname Number End"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Number of GPUs Per Server -->
    <q-input
      v-model.number="form.numberOfGpusPerServer"
      type="number"
      label="Number of GPUs Per Server"
      dark
      outlined
      required
      :rules="[(val) => val > 0 || 'Must be greater than 0']"
    />

    <!-- Server Rack Unit Size -->
    <q-input
      v-model.number="form.serverRackUnitSize"
      type="number"
      label="Server Rack Unit Size"
      dark
      outlined
      required
      :rules="[(val) => val > 0 || 'Must be greater than 0']"
    />

    <!-- Server Dimensions -->
    <q-input
      v-model.trim="form.serverWidth"
      label="Server Width"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Server width is required']"
      placeholder="Enter server width"
    />
    <q-input
      v-model.trim="form.serverDepth"
      label="Server Depth"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Server depth is required']"
      placeholder="Enter server depth"
    />

    <!-- Server Cost -->
    <q-input
      v-model.number="form.serverCost"
      type="number"
      label="Server Cost"
      dark
      outlined
      required
      :rules="[(val) => val > 0 || 'Must be greater than 0']"
    />

    <!-- Total Number of Fiber Ports Per Server -->
    <q-input
      v-model.number="form.totalNumberOfFiberPortsPerServer"
      type="number"
      label="Total Fiber Ports Per Server"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Total Number of Copper Ports Per Server -->
    <q-input
      v-model.number="form.totalNumberOfCopperPortsPerServer"
      type="number"
      label="Total Copper Ports Per Server"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Number of Backend Ports -->
    <q-input
      v-model.number="form.numberOfBackendPorts"
      type="number"
      label="Number of Backend Ports"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Backend Transceiver Type -->
    <q-input
      v-model.trim="form.backendTransceiverType"
      label="Backend Transceiver Type"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Backend transceiver type is required']"
      placeholder="Enter backend transceiver type"
    />

    <!-- Number of Frontend Mgmt Ports -->
    <q-input
      v-model.number="form.numberOfFrontendMgmtPorts"
      type="number"
      label="Number of Frontend Mgmt Ports"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Frontend Transceiver Type -->
    <q-input
      v-model.trim="form.frontendTransceiverType"
      label="Frontend Transceiver Type"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Frontend transceiver type is required']"
      placeholder="Enter frontend transceiver type"
    />

    <!-- Number of Out of Band Ports -->
    <q-input
      v-model.number="form.numberOfOutOfBandPorts"
      type="number"
      label="Number of Out of Band Ports"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Out of Band Type -->
    <q-input
      v-model.trim="form.outOfBandType"
      label="Out of Band Type"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Out of band type is required']"
      placeholder="Enter out of band type"
    />

    <!-- Number of Storage Mgmt Ports -->
    <q-input
      v-model.number="form.numberOfStorageMgmtPorts"
      type="number"
      label="Number of Storage Mgmt Ports"
      dark
      outlined
      required
      :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
    />

    <!-- Storage Transceiver Type -->
    <q-input
      v-model.trim="form.storageTransceiverType"
      label="Storage Transceiver Type"
      dark
      outlined
      required
      :rules="[(val) => !!val || 'Storage transceiver type is required']"
      placeholder="Enter storage transceiver type"
    />


    <!-- GPU Compute Rack Selection -->
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
        @update:model-value="val => console.log('GPU Compute Rack selected:', val)"
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
import { Server, GpuComputeRack } from "src/types/models";
import { serverService } from "src/services/serverService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { gpuComputeRackService } from "src/services/gpuComputeRackService";

export default defineComponent({
  name: "ServerList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["server-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const servers = ref<Server[]>([]);
    const racks = ref<GpuComputeRack[]>([]);
    const filter = ref("");
    const selectedServers = ref<Server[]>([]);

    const columns = [
  {
    name: "name",
    required: true,
    label: "Server Name",
    align: "left" as "left",
    field: "name",
    sortable: true,
  },
  {
    name: "deviceModelName",
    required: true,
    label: "Device Model Name",
    align: "left" as "left",
    field: "deviceModelName",
    sortable: true,
  },
  {
    name: "deviceHostName",
    required: true,
    label: "Device Host Name",
    align: "left" as "left",
    field: "deviceHostName",
    sortable: true,
  },
  {
    name: "deviceHostNameNumberStart",
    required: true,
    label: "Device Host Name Start",
    align: "left" as "left",
    field: "deviceHostNameNumberStart",
    sortable: true,
  },
  {
    name: "deviceHostNameNumberEnd",
    required: true,
    label: "Device Host Name End",
    align: "left" as "left",
    field: "deviceHostNameNumberEnd",
    sortable: true,
  },
  {
    name: "numberOfGpusPerServer",
    required: true,
    label: "Number of GPUs per Server",
    align: "left" as "left",
    field: "numberOfGpusPerServer",
    sortable: true,
  },
  {
    name: "serverRackUnitSize",
    required: true,
    label: "Server Rack Unit Size",
    align: "left" as "left",
    field: "serverRackUnitSize",
    sortable: true,
  },
  {
    name: "serverWidth",
    required: true,
    label: "Server Width",
    align: "left" as "left",
    field: "serverWidth",
    sortable: true,
  },
  {
    name: "serverDepth",
    required: true,
    label: "Server Depth",
    align: "left" as "left",
    field: "serverDepth",
    sortable: true,
  },
  {
    name: "serverCost",
    required: true,
    label: "Server Cost",
    align: "left" as "left",
    field: "serverCost",
    sortable: true,
  },
  {
    name: "totalNumberOfFiberPortsPerServer",
    required: true,
    label: "Total Fiber Ports per Server",
    align: "left" as "left",
    field: "totalNumberOfFiberPortsPerServer",
    sortable: true,
  },
  {
    name: "totalNumberOfCopperPortsPerServer",
    required: true,
    label: "Total Copper Ports per Server",
    align: "left" as "left",
    field: "totalNumberOfCopperPortsPerServer",
    sortable: true,
  },
  {
    name: "numberOfBackendPorts",
    required: true,
    label: "Number of Backend Ports",
    align: "left" as "left",
    field: "numberOfBackendPorts",
    sortable: true,
  },
  {
    name: "backendTransceiverType",
    required: true,
    label: "Backend Transceiver Type",
    align: "left" as "left",
    field: "backendTransceiverType",
    sortable: true,
  },
  {
    name: "numberOfFrontendMgmtPorts",
    required: true,
    label: "Number of Frontend Management Ports",
    align: "left" as "left",
    field: "numberOfFrontendMgmtPorts",
    sortable: true,
  },
  {
    name: "frontendTransceiverType",
    required: true,
    label: "Frontend Transceiver Type",
    align: "left" as "left",
    field: "frontendTransceiverType",
    sortable: true,
  },
  {
    name: "numberOfOutOfBandPorts",
    required: true,
    label: "Number of Out-of-Band Ports",
    align: "left" as "left",
    field: "numberOfOutOfBandPorts",
    sortable: true,
  },
  {
    name: "outOfBandType",
    required: true,
    label: "Out-of-Band Type",
    align: "left" as "left",
    field: "outOfBandType",
    sortable: true,
  },
  {
    name: "numberOfStorageMgmtPorts",
    required: true,
    label: "Number of Storage Management Ports",
    align: "left" as "left",
    field: "numberOfStorageMgmtPorts",
    sortable: true,
  },
  {
    name: "storageTransceiverType",
    required: true,
    label: "Storage Transceiver Type",
    align: "left" as "left",
    field: "storageTransceiverType",
    sortable: true,
  },
    {
      name: "gpuComputeRackId",
      label: "GPU Compute Rack",
      align: "left",
      field: (row: { gpuComputeRackId: number }) => {
        // Use gpuComputeRackOptions to find the name
        const rackOption = gpuComputeRackOptions.value.find(option => option.value === row.gpuComputeRackId);
        return rackOption ? rackOption.label : "N/A";
      },
      sortable: true,
    }
];

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      serverId: null as number | null,
    });

    const form = ref<Partial<Server>>({
        name: '',
        numberOfServersPerRack: 0,
        powerLimitPerGpuComputeRack: 0,
        containsFiberPatchPanel: false,
        containsCopperPatchPanel: false,
        numberOfFiberPatchPanels: 0,
        numberOfCopperPatchPanels: 0,
        powerFeedActive: false,
        temperatureFeedActive: false,
        waterLeakDetectionActive: false,
        doorAccessSensorActive: false,
        gpuComputeRackId: null,
    });

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedServers.value.length > 0
        ? `Are you sure you want to delete ${selectedServers.value.length} server(s)?`
        : "Are you sure you want to delete this server?";
    });

    const gpuComputeRackOptions = computed(() =>
      racks.value.map((rack) => ({
        label: rack.name,
        value: rack.id,
      }))
    );

const filteredServers = computed(() => {
  if (!filter.value) return servers.value;
  const searchTerm = filter.value.toLowerCase();

  return servers.value.filter((server) => {
    // Check if any of the server fields match the search term
    const matchesServerFields = Object.values(server).some((value) =>
      value && value.toString().toLowerCase().includes(searchTerm)
    );

    // Check if the gpuComputeRack name matches the search term (check if gpuComputeRack exists)
    const matchesGpuComputeRack = server.gpuComputeRack && 
      server.gpuComputeRack.name.toLowerCase().includes(searchTerm);

    // Return true if any of the checks match the search term
    return matchesServerFields || matchesGpuComputeRack;
  });
});

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        deviceHostNameNumberStart: 0,
        deviceHostNameNumberEnd: 0,
        numberOfGpusPerServer: 0,
        serverRackUnitSize: 0,
        totalNumberOfFiberPortsPerServer: 0,
        totalNumberOfCopperPortsPerServer: 0,
        numberOfBackendPorts: 0,
        numberOfFrontendMgmtPorts: 0,
        numberOfOutOfBandPorts: 0,
        numberOfStorageMgmtPorts: 0,
        serverCost: 0,
      };
    };

    const fetchServers = async () => {
      loading.value = true;
      try {
        servers.value = await serverService.getServersByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRacks = async () => {
      try {
        racks.value = await gpuComputeRackService.getGpuComputeRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch GPU compute racks:", error);
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Server",
        mode: "create",
      };
    };

    const openEditDialog = (server: Server) => {
      form.value = { ...server };
      dialog.value = {
        show: true,
        title: "Edit Server",
        mode: "edit",
      };
      deleteDialog.value.serverId = server.id;
    };

    const confirmDelete = (serverId: number) => {
      deleteDialog.value = {
        show: true,
        serverId: serverId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          ...form.value,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          gpuComputeRackId: Number(form.value.gpuComputeRackId),
        };

        if (dialog.value.mode === "create") {
          await serverService.createServer(submitData);
        } else {
          if (deleteDialog.value.serverId) {
            await serverService.updateServer(deleteDialog.value.serverId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchServers();
        emit("server-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} server:`, error);
      }
    };
    const handleDelete = async () => {
      try {
        if (selectedServers.value.length > 0) {
          for (const server of selectedServers.value) {
            await serverService.deleteServer(server.id);
          }
          selectedServers.value = [];
        } else if (deleteDialog.value.serverId) {
          await serverService.deleteServer(deleteDialog.value.serverId);
        }
        await fetchServers();
        emit("server-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete server(s):", error);
      }
    };

    onMounted(() => {
      fetchServers();
      fetchRacks();
    });

    return {
      loading,
      servers,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedServers,
      deleteConfirmMessage,
      isFormValid,
      gpuComputeRackOptions,
      filteredServers,
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
