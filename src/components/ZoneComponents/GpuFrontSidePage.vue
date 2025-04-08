<template>
  <div class="gpu-frontside-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      GPU Front Side
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="GPU Front Side" v-model:search-term="filter"
      :has-selected="selectedGpuFrontSides.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredGpuFrontSides" :columns="columns" :loading="loading"
      v-model:selected="selectedGpuFrontSides" @edit="openEditDialog" @delete="confirmDelete" />

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
import { GpuFrontSide, Gpu } from "src/types/models";
import { gpufrontsideService } from "src/services/gpuFrontSideService";
import { gpuService } from "src/services/gpuService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "GpuFrontSideList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["gpu-frontside-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const gpuFrontSides = ref<GpuFrontSide[]>([]);
    const gpus = ref<Gpu[]>([]);
    const filter = ref("");
    const selectedGpuFrontSides = ref<GpuFrontSide[]>([]);

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
      gpuFrontSideId: null as number | null,
    });

    const form = ref<Partial<GpuFrontSide>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedGpuFrontSides.value.length > 0
        ? `Are you sure you want to delete ${selectedGpuFrontSides.value.length} GPU Front Side(s)?`
        : "Are you sure you want to delete this GPU Front Side?";
    });

    const gpuOptions = computed(() =>
      gpus.value.map((gpu) => ({
        label: gpu.name,
        value: gpu.id,
      }))
    );

const filteredGpuFrontSides = computed(() => {
  if (!filter.value) return gpuFrontSides.value;

  const searchTerm = filter.value.toLowerCase();

  return gpuFrontSides.value.filter(gpuFrontSide => {
    const gpuName = gpuFrontSide.gpu?.name || '';
    return (
      gpuFrontSide.name.toLowerCase().includes(searchTerm) || 
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

    const fetchGpuFrontSides = async () => {
      loading.value = true;
      try {
        gpuFrontSides.value = await gpufrontsideService
        .getGpuFrontSidesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch GPU Front Sides:", error);
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
        title: "Create New GPU Front Side",
        mode: "create",
      };
    };


const openEditDialog = (gpuFrontSide: GpuFrontSide) => {
  form.value = { ...gpuFrontSide };

  // Find the corresponding GPU option by GPU ID
  const selectedGpu = gpus.value.find(gpu => gpu.id === gpuFrontSide.gpuId);
  if (selectedGpu) {
    // Set the dropdown value to the full option (label + value)
    form.value.gpuId = { label: selectedGpu.name, value: selectedGpu.id };
  }

  dialog.value = {
    show: true,
    title: "Edit GPU Front Side",
    mode: "edit",
  };

  deleteDialog.value.gpuFrontSideId = gpuFrontSide.id;
};


    // const openEditDialog = (gpuFrontSide: GpuFrontSide) => {
    //   form.value = { ...gpuFrontSide };
    //   dialog.value = {
    //     show: true,
    //     title: "Edit GPU Front Side",
    //     mode: "edit",
    //   };
    //   deleteDialog.value.gpuFrontSideId = gpuFrontSide.id;
    // };

    const confirmDelete = (gpuFrontSideId: number) => {
      deleteDialog.value = {
        show: true,
        gpuFrontSideId: gpuFrontSideId,
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
          await gpufrontsideService.createGpuFrontSide(submitData);
        } else {
          if (deleteDialog.value.gpuFrontSideId) {
            await gpufrontsideService.updateGpuFrontSide(
              deleteDialog.value.gpuFrontSideId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchGpuFrontSides();
        emit("gpu-frontside-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} GPU Front Side:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedGpuFrontSides.value.length > 0) {
          for (const gpuFrontSide of selectedGpuFrontSides.value) {
            await gpufrontsideService.deleteGpuFrontSide(gpuFrontSide.id);
          }
          selectedGpuFrontSides.value = [];
        } else if (deleteDialog.value.gpuFrontSideId) {
          await gpufrontsideService.deleteGpuFrontSide(deleteDialog.value.gpuFrontSideId);
        }
        await fetchGpuFrontSides();
        emit("gpu-frontside-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete GPU Front Side(s):", error);
      }
    };

    onMounted(() => {
      fetchGpuFrontSides();
      fetchRelatedData();
    });

    return {
      loading,
      gpuFrontSides,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedGpuFrontSides,
      deleteConfirmMessage,
      isFormValid,
      gpuOptions,
      filteredGpuFrontSides,
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
