<template>
  <div class="patchPanelPort-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      PatchPanelPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="PatchPanelPort" v-model:search-term="filter"
      :has-selected="selectedPatchPanelPorts.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredpatchPanelPorts" :columns="columns" :loading="loading"
      v-model:selected="selectedPatchPanelPorts" @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

        <q-input v-model.trim="form.name" label="Name" dark outlined type="string" required
          :rules="[(val) => !!val || 'name is required']" placeholder="Enter name" />

        <q-input v-model.number.trim="form.locatedInRUNumber" label="LocatedinRUNumber" dark outlined type="number"
          required :rules="[(val) => !!val || 'locatedInRUNumber is required']" placeholder="Enter locatedinrunumber" />
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
import { PatchPanelPort } from "src/types/models";
import { patchPanelPortService } from "src/services/patchPanelPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "PatchPanelPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["patchPanelPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const patchPanelPorts = ref<PatchPanelPort[]>([]);
    const filter = ref("");
    const selectedPatchPanelPorts = ref<PatchPanelPort[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      }, {
        name: "locatedInRUNumber",
        required: true,
        label: "Located in RU number",
        align: "left" as "left",
        field: "locatedInRUNumber",
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
      patchPanelPortId: null as number | null,
    });

    const form = ref<Partial<PatchPanelPort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedPatchPanelPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedPatchPanelPorts.value.length} patchPanelPort(s)?`
        : "Are you sure you want to delete this patchPanelPort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchPatchPanelPorts = async () => {
      loading.value = true;
      try {
        patchPanelPorts.value = await patchPanelPortService.getPatchPanelPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch patchPanelPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const filteredpatchPanelPorts = computed(() => {
      if (!filter.value) {
        return patchPanelPorts.value; // If no filter, return all rack units
      }
      return patchPanelPorts.value.filter((patchPanelPort) =>
        patchPanelPort.name.toLowerCase().includes(filter.value.toLowerCase())
      );
    });


    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New PatchPanelPort",
        mode: "create",
      };
    };

    const openEditDialog = (patchPanelPort: PatchPanelPort) => {
      form.value = { ...patchPanelPort };
      dialog.value = {
        show: true,
        title: "Edit PatchPanelPort",
        mode: "edit",
      };
      deleteDialog.value.patchPanelPortId = patchPanelPort.id;
    };

    const confirmDelete = (patchPanelPortId: number) => {
      deleteDialog.value = {
        show: true,
        patchPanelPortId: patchPanelPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    // Prepare data for submission
    const submitData = {
      name: form.value.name,
      locatedInRUNumber: Number(form.value.locatedInRUNumber),
      customerId: Number(form.value.customerId),
      dataHallId: Number(form.value.dataHallId),
    };

    // Check if the operation is "create" or "update"
    if (dialog.value.mode === "create") {
      // Create a new PatchPanelPort
      await patchPanelPortService.createPatchPanelPort(submitData);
    } else if (dialog.value.mode === "update" && deleteDialog.value.patchPanelPortId) {
      // Update an existing PatchPanelPort
      await patchPanelPortService.updatePatchPanelPort(
        deleteDialog.value.patchPanelPortId,
        submitData
      );
    }

    // Close the dialog and refresh the list of PatchPanelPorts
    dialog.value.show = false;
    await fetchPatchPanelPorts();
    emit("patchPanelPort-updated");
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} patch panel port:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedPatchPanelPorts.value.length > 0) {
          for (const patchPanelPort of selectedPatchPanelPorts.value) {
            await patchPanelPortService.deletePatchPanelPort(patchPanelPort.id);
          }
          selectedPatchPanelPorts.value = [];
        } else if (deleteDialog.value.patchPanelPortId) {
          await patchPanelPortService.deletePatchPanelPort(deleteDialog.value.patchPanelPortId);
        }
        await fetchPatchPanelPorts();
        emit("patchPanelPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete patchPanelPort(s):", error);
      }
    };

    onMounted(() => {
      fetchPatchPanelPorts();
    });

    return {
      loading,
      filteredpatchPanelPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedPatchPanelPorts,
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