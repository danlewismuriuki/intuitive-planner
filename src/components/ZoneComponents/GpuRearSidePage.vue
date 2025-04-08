<template>
  <div class="gpu-rearside-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      GPU Rear Side
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="GPU Rear Side" v-model:search-term="filter"
      :has-selected="selectedGpuRearSides.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredGpuRearSides" :columns="columns" :loading="loading"
      v-model:selected="selectedGpuRearSides" @edit="openEditDialog" @delete="confirmDelete" />

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
          placeholder="Enter name" />

        <q-select
          v-model="form.gpuId"
          :options="gpuOptions"
          label="GPU"
          dark
          outlined
          required
          :rules="[(val) => !!val || 'GPU is required']"
          option-value="value"
          option-label="label" />

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
import { GpuRearSide, Gpu } from "src/types/models";
import { gpuRearSideService } from "src/services/gpuRearSideService";
import { gpuService } from "src/services/gpuService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "GpuRearSideList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["gpu-rearside-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const gpuRearSides = ref<GpuRearSide[]>([]);
    const gpus = ref<Gpu[]>([]);
    const filter = ref("");
    const selectedGpuRearSides = ref<GpuRearSide[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      },{
        name: "gpuId",
        required: true,
        label: "Gpu Name",
        align: "left",
        field: (row) => {
          const gpu = gpus.value.find((gpu) => gpu.id === row.gpuId);
          return gpu ? gpu.name : "N/A";
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
      gpuRearSideId: null as number | null,
    });

    const form = ref<Partial<GpuRearSide>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedGpuRearSides.value.length > 0
        ? `Are you sure you want to delete ${selectedGpuRearSides.value.length} GPU Rear Side(s)?`
        : "Are you sure you want to delete this GPU Rear Side?";
    });

    const gpuOptions = computed(() =>
      gpus.value.map((gpu) => ({
        label: gpu.name,
        value: gpu.id,
      }))
    );

const filteredGpuRearSides = computed(() => {
  if (!filter.value) return gpuRearSides.value;

  const searchTerm = filter.value.toLowerCase();

  return gpuRearSides.value.filter(gpuRearSide => {
    const gpuName = gpuRearSide.gpu?.name || '';
    return (
      gpuRearSide.name.toLowerCase().includes(searchTerm) || 
      gpuName.toLowerCase().includes(searchTerm)
    );
  });
});



    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        name: "",
        gpu: undefined,
      };
    };

    const fetchGpuRearSides = async () => {
      loading.value = true;
      try {
        gpuRearSides.value = await gpuRearSideService
        .getGpuRearSidesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch GPU Rear Sides:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
      try {
        gpus.value = await gpuService
        .getGpusByCustomerAndDataHallId(customerId, dataHallId);
      } catch (error) {
        console.error("Failed to fetch related data:", error);
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New GPU Rear Side",
        mode: "create",
      };
    };


const openEditDialog = (gpuRearSide: GpuRearSide) => {
  form.value = { ...gpuRearSide };

  // Find the corresponding GPU option by GPU ID
  const selectedGpu = gpus.value.find(gpu => gpu.id === gpuRearSide.gpuId);
  if (selectedGpu) {
    // Set the dropdown value to the full option (label + value)
    form.value.gpuId = { label: selectedGpu.name, value: selectedGpu.id };
  }

  dialog.value = {
    show: true,
    title: "Edit GPU Rear Side",
    mode: "edit",
  };

  deleteDialog.value.gpuRearSideId = gpuRearSide.id;
};


    // const openEditDialog = (gpuRearSide: GpuRearSide) => {
    //   form.value = { ...gpuRearSide };
    //   dialog.value = {
    //     show: true,
    //     title: "Edit GPU Rear Side",
    //     mode: "edit",
    //   };
    //   deleteDialog.value.gpuRearSideId = gpuRearSide.id;
    // };

    const confirmDelete = (gpuRearSideId: number) => {
      deleteDialog.value = {
        show: true,
        gpuRearSideId: gpuRearSideId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      console.log('Form Data before submission:', form.value);
      try {
        const submitData = {
          name: form.value.name,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          // gpuId: Number(form.value.gpuId),
          // gpuId: Number(form.value.gpuId)
          // gpuId: form.value.gpuId,
          // rackTypeId: form.value.rackTypeId,
          gpuId: form.value.gpuId.value 
        }
        console.log('Submit Data:', submitData);

        if (dialog.value.mode === "create") {
          await gpuRearSideService.createGpuRearSide(submitData);
        } else {
          if (deleteDialog.value.gpuRearSideId) {
            await gpuRearSideService.updateGpuRearSide(
              deleteDialog.value.gpuRearSideId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchGpuRearSides();
        emit("gpu-rearside-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} GPU Rear Side:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedGpuRearSides.value.length > 0) {
          for (const gpuRearSide of selectedGpuRearSides.value) {
            await gpuRearSideService.deleteGpuRearSide(gpuRearSide.id);
          }
          selectedGpuRearSides.value = [];
        } else if (deleteDialog.value.gpuRearSideId) {
          await gpuRearSideService.deleteGpuRearSide(deleteDialog.value.gpuRearSideId);
        }
        await fetchGpuRearSides();
        emit("gpu-rearside-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete GPU Rear Side(s):", error);
      }
    };

    onMounted(() => {
      fetchGpuRearSides();
      fetchRelatedData();
    });

    return {
      loading,
      gpuRearSides,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedGpuRearSides,
      deleteConfirmMessage,
      isFormValid,
      gpuOptions,
      filteredGpuRearSides,
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
