<template>
  <div class="gpu-management q-pa-md" style="background: #2d2d3a; color: white">
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      GPUs
    </div>

    <SearchHeader
      item-name="GPU"
      v-model:search-term="filter"
      :has-selected="selectedGpus.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <DataTable
      :rows="filteredGpus"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedGpus"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

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
          :rules="[(val) => !!val || 'Name is required']"
          placeholder="Enter GPU Name"
        />

        <q-input
          v-model.number.trim="form.numberFiberPortsPerGPU"
          label="Number of Fiber Ports per GPU"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'Number of Fiber Ports per GPU is required']"
          placeholder="Enter Number of Fiber Ports per GPU"
        />

        <q-input
          v-model.number.trim="form.numberFiberPortsPerGPUFrontSide"
          label="Number of Fiber Ports per GPU Front Side"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'Number of Fiber Ports per GPU Front Side is required']"
          placeholder="Enter Number of Fiber Ports per GPU Front Side"
        />

        <q-input
          v-model.number.trim="form.fiberPortsPerGPURearSide"
          label="Fiber Ports per GPU Rear Side"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'Fiber Ports per GPU Rear Side is required']"
          placeholder="Enter Fiber Ports per GPU Rear Side"
        />

        <q-input
          v-model.number.trim="form.powerPerGPU"
          label="Power per GPU"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'Power per GPU is required']"
          placeholder="Enter Power per GPU"
        />

        <q-input
          v-model.trim="form.gpuType"
          label="GPU Type"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'GPU Type is required']"
          placeholder="Enter GPU Type"
        />

        <q-input
          v-model.number.trim="form.gpuCost"
          label="GPU Cost"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'GPU Cost is required']"
          placeholder="Enter GPU Cost"
        />
 
        <q-select
          v-model="form.serverId"
          :options="serverOptions"
          label="Server"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'Server is required']"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
      </q-form>
    </FormDialog>

    <ConfirmationDialog
      v-model="deleteDialog.show"
      :message="deleteConfirmMessage"
      confirm-label="DELETE"
      @confirm="handleDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Gpu, Server } from 'src/types/models';
import { gpuService } from '../../services/gpuService';
import { serverService } from '../../services/serverService';
import SearchHeader from '../FormComponents/SearchHeader.vue';
import DataTable from '../FormComponents/DataTable.vue';
import FormDialog from '../FormComponents/FormDialog.vue';
import ConfirmationDialog from '../FormComponents/ConfirmationDialog.vue';

export default defineComponent({
  name: 'GpuManagement',
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ['gpu-updated'],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split('/')[2]);
    const loading = ref(false);
    const gpus = ref<Gpu[]>([]);
    const servers = ref<Server[]>([]);
    const filter = ref('');
    const selectedGpus = ref<Gpu[]>([]);

    const form = ref<Partial<Gpu>>({});

    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left' as 'left',
        field: 'name',
        sortable: true,
      },{
        name: 'numberFiberPortsPerGPU',
        label: 'Number of Fiber Ports per GPU',
        field: 'numberFiberPortsPerGPU',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'numberFiberPortsPerGPUFrontSide',
        label: 'Number of Fiber Ports per GPU Front Side',
        field: 'numberFiberPortsPerGPUFrontSide',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'fiberPortsPerGPURearSide',
        label: 'Fiber Ports per GPU Rear Side',
        field: 'fiberPortsPerGPURearSide',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'powerPerGPU',
        label: 'Power per GPU',
        field: 'powerPerGPU',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'gpuType',
        label: 'GPU Type',
        field: 'gpuType',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'gpuCost',
        label: 'GPU Cost',
        field: 'gpuCost',
        sortable: true,
        align: 'left' as 'left',
        required: true
      },{
        name: 'server',
        label: 'Server',
        align: 'left' as 'left',
        field: (row: Gpu) => {
          const server = servers.value.find((s) => s.id === row.serverId);
          return server ? server.name : 'N/A';
        },
        sortable: true,
      },
    ];

    const fetchRelatedData = async () => {
      try {
        const [fetchedServers] = await Promise.all([
          serverService.getAllServers(),
        ]);
        servers.value = fetchedServers;
      } catch (error) {
        console.error('Failed to fetch related data:', error);
      }
    };

    const fetchGpus = async () => {
      loading.value = true;
      try {
        gpus.value = await gpuService.getGpusByCustomerAndDataHallId(customerId, dataHallId);
      } catch (error) {
        console.error('Failed to fetch GPUs:', error);
      } finally {
        loading.value = false;
      }
    };

    const deleteDialog = ref({
  show: false,
  gpuId: null as number | null,
});

const dialog = ref({
  show: false,
  title: '',
  mode: 'create',
});


const deleteConfirmMessage = computed(() => {
    return selectedGpus.value.length > 0
      ? `Are you sure you want to delete ${selectedGpus.value.length} GPUs?`
      : 'Are you sure you want to delete this GPU?';
  });

  const resetFormData = () => {
    form.value = {}
  };
  

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: 'Create New GPU',
        mode: 'create',
      };
    };

    const openEditDialog = (gpu: Gpu) => {
      form.value = { ...gpu };
      dialog.value = {
        show: true,
        title: 'Edit GPU',
        mode: 'edit',
      };
      deleteDialog.value.gpuId = gpu.id;
    };

    const confirmDelete = (gpuId: number) => {
      deleteDialog.value = {
        show: true,
        gpuId: gpuId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const serverOptions = computed(() => {
    return servers.value.map((server) => ({
      label: server.name,
      value: server.id,
    }));
  });


const filteredGpus = computed(() => {
  if (!filter.value) return gpus.value;
  const searchTerm = filter.value.toLowerCase();

  return gpus.value.filter((gpu) => {
    const matchesGpuFields = Object.values(gpu).some((value) =>
      value && value.toString().toLowerCase().includes(searchTerm)
    );
    const matchesCustomer = gpu.customer && gpu.customer.name.toLowerCase().includes(searchTerm);
    // Filter based on server label:
    const selectedServerOption = serverOptions.value.find(option => option.label.toLowerCase().includes(searchTerm));
    const matchesServer = selectedServerOption && gpu.serverId === selectedServerOption.value;
    return matchesGpuFields || matchesCustomer || matchesServer;
  });
});

const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const handleSubmit = async () => {
      try {
        const updatedData = {
          name: form.value.name,
          numberFiberPortsPerGPU: form.value.numberFiberPortsPerGPU,
          customerId,
          dataHallId,
          serverId: form.value.serverId,
          fiberPortsPerGPURearSide: form.value.fiberPortsPerGPURearSide,
          numberFiberPortsPerGPUFrontSide: form.value.numberFiberPortsPerGPUFrontSide,
          powerPerGPU: form.value.powerPerGPU,
          gpuType: form.value.gpuType,
          gpuCost: form.value.gpuCost,
          
        };

        if (dialog.value.mode === 'create') {
          await gpuService.createGpu(updatedData);
        } else {
          if (deleteDialog.value.gpuId) {
            await gpuService.updateGpu(deleteDialog.value.gpuId, updatedData);
          }
        }

        dialog.value.show = false;
        await fetchGpus();
        emit('gpu-updated');
      } catch (error) {
        alert('Failed to save data. Please try again.');
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedGpus.value.length > 0) {
          for (const gpu of selectedGpus.value) {
            await gpuService.deleteGpu(gpu.id);
          }
          selectedGpus.value = [];
        } else if (deleteDialog.value.gpuId) {
          await gpuService.deleteGpu(deleteDialog.value.gpuId);
        }
        await fetchGpus();
        emit('gpu-updated');
        deleteDialog.value.show = false;
      } catch (error) {
        console.error('Failed to delete GPU(s):', error);
      }
    };

    onMounted(() => {
      fetchGpus();
      fetchRelatedData();
    });

    return {
  loading,
  gpus,
  columns,
  filter,
  dialog,
  deleteDialog,
  form,
  selectedGpus,
  filteredGpus,
  serverOptions,
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