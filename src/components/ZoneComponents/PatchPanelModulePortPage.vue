<template>
  <div
    class="patchPanelModulePort-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      PatchPanelModulePorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="PatchPanelModulePort"
      v-model:search-term="filter"
      :has-selected="selectedPatchPanelModulePorts.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="patchPanelModulePorts"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedPatchPanelModulePorts"
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
          v-model.trim="form.portLocationFrontOrBack"
          label="Port Location (Front or Back)"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'Port location is required']"
          placeholder="Enter port location"
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
import { PatchPanelModulePort } from "src/types/models";
import { patchPanelModulePortService } from "../../services/patchPanelModulePortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "PatchPanelModulePortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["patchPanelModulePort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const patchPanelModulePorts = ref<PatchPanelModulePort[]>([]);
    const filter = ref("");
    const selectedPatchPanelModulePorts = ref<PatchPanelModulePort[]>([]);

    const columns = [
      {
        name: "portLocationFrontOrBack",
        required: true,
        label: "Port Location (Front or Back)",
        align: "left" as "left",
        field: "portLocationFrontOrBack",
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
      patchPanelModulePortId: null as number | null,
    });

    const form = ref<Partial<PatchPanelModulePort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedPatchPanelModulePorts.value.length > 0
        ? `Are you sure you want to delete ${selectedPatchPanelModulePorts.value.length} patchPanelModulePort(s)?`
        : "Are you sure you want to delete this patchPanelModulePort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchPatchPanelModulePorts = async () => {
      loading.value = true;
      try {
        patchPanelModulePorts.value =
          await patchPanelModulePortService.getPatchPanelModulePortsByCustomerAndDataHallId(
            customerId,
            dataHallId
          );
      } catch (error) {
        console.error("Failed to fetch patchPanelModulePorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New PatchPanelModulePort",
        mode: "create",
      };
    };

    const openEditDialog = (patchPanelModulePort: PatchPanelModulePort) => {
      form.value = { ...patchPanelModulePort };
      dialog.value = {
        show: true,
        title: "Edit PatchPanelModulePort",
        mode: "edit",
      };
      deleteDialog.value.patchPanelModulePortId = patchPanelModulePort.id;
    };

    const confirmDelete = (patchPanelModulePortId: number) => {
      deleteDialog.value = {
        show: true,
        patchPanelModulePortId: patchPanelModulePortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          portLocationFrontOrBack: form.value.portLocationFrontOrBack,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
        };

        if (dialog.value.mode === "create") {
          await patchPanelModulePortService.createPatchPanelModulePort(
            submitData
          );
        } else {
          if (deleteDialog.value.patchPanelModulePortId) {
            await patchPanelModulePortService.updatePatchPanelModulePort(
              deleteDialog.value.patchPanelModulePortId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchPatchPanelModulePorts();
        emit("patchPanelModulePort-updated");
      } catch (error) {
        console.error(
          `Failed to ${dialog.value.mode} patch panel module port:`,
          error
        );
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedPatchPanelModulePorts.value.length > 0) {
          for (const patchPanelModulePort of selectedPatchPanelModulePorts.value) {
            await patchPanelModulePortService.deletePatchPanelModulePort(
              patchPanelModulePort.id
            );
          }
          selectedPatchPanelModulePorts.value = [];
        } else if (deleteDialog.value.patchPanelModulePortId) {
          await patchPanelModulePortService.deletePatchPanelModulePort(
            deleteDialog.value.patchPanelModulePortId
          );
        }
        await fetchPatchPanelModulePorts();
        emit("patchPanelModulePort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete patchPanelModulePort(s):", error);
      }
    };

    onMounted(() => {
      fetchPatchPanelModulePorts();
    });

    return {
      loading,
      patchPanelModulePorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedPatchPanelModulePorts,
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
