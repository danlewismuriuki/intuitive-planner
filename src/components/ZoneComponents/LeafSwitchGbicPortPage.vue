<template>
  <div
    class="leafSwitchGbicPort-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      LeafSwitchGbicPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="LeafSwitchGbicPort"
      v-model:search-term="filter"
      :has-selected="selectedLeafSwitchGbicPorts.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="leafSwitchGbicPorts"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedLeafSwitchGbicPorts"
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
          v-model.trim="form.nameOfFiberGbic"
          label="Nameoffibergbic"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfFiberGbic is required']"
          placeholder="Enter nameoffibergbic"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberPortsPerGbic"
          label="Numberoffiberportspergbic"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberPortsPerGbic is required']"
          placeholder="Enter numberoffiberportspergbic"
        />

        <q-toggle
          v-model="form.sideAInstalledOnLeft"
          label="Sideainstalledonleft"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.sideBInstalledOnLeft"
          label="Sidebinstalledonleft"
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
import { LeafSwitchGbicPort } from "src/types/models";
import { leafSwitchGbicPortService } from "../../services/leafSwitchGbicPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "LeafSwitchGbicPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["leafSwitchGbicPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const leafSwitchGbicPorts = ref<LeafSwitchGbicPort[]>([]);
    const filter = ref("");
    const selectedLeafSwitchGbicPorts = ref<LeafSwitchGbicPort[]>([]);

    const columns = [
      {
        name: "nameOfFiberGbic",
        required: true,
        label: "Nameoffibergbic",
        align: "left" as "left",
        field: "nameOfFiberGbic",
        sortable: true,
      },{
        name: "numberOfFiberPortsPerGbic",
        required: true,
        label: "Numberoffiberportspergbic",
        align: "left" as "left",
        field: "numberOfFiberPortsPerGbic",
        sortable: true,
      },{
        name: "sideAInstalledOnLeft",
        required: true,
        label: "Sideainstalledonleft",
        align: "left" as "left",
        field: "sideAInstalledOnLeft",
        sortable: true,
      },{
        name: "sideBInstalledOnLeft",
        required: true,
        label: "Sidebinstalledonleft",
        align: "left" as "left",
        field: "sideBInstalledOnLeft",
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
      leafSwitchGbicPortId: null as number | null,
    });

    const form = ref<Partial<LeafSwitchGbicPort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedLeafSwitchGbicPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedLeafSwitchGbicPorts.value.length} leafSwitchGbicPort(s)?`
        : "Are you sure you want to delete this leafSwitchGbicPort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchLeafSwitchGbicPorts = async () => {
      loading.value = true;
      try {
        leafSwitchGbicPorts.value = await leafSwitchGbicPortService.
        getLeafSwitchGbicPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch leafSwitchGbicPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New LeafSwitchGbicPort",
        mode: "create",
      };
    };

    const openEditDialog = (leafSwitchGbicPort: LeafSwitchGbicPort) => {
      form.value = { ...leafSwitchGbicPort };
      dialog.value = {
        show: true,
        title: "Edit LeafSwitchGbicPort",
        mode: "edit",
      };
      deleteDialog.value.leafSwitchGbicPortId = leafSwitchGbicPort.id;
    };

    const confirmDelete = (leafSwitchGbicPortId: number) => {
      deleteDialog.value = {
        show: true,
        leafSwitchGbicPortId: leafSwitchGbicPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      nameOfFiberGbic: form.value.nameOfFiberGbic,
      numberOfFiberPortsPerGbic: Number(form.value.numberOfFiberPortsPerGbic),
      sideAInstalledOnLeft: form.value.sideAInstalledOnLeft,
      sideBInstalledOnLeft: form.value.sideBInstalledOnLeft,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId)
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await leafSwitchGbicPortService.createLeafSwitchGbicPort(submitData);
    } else {
      if (deleteDialog.value.leafSwitchGbicPortId) {
        await leafSwitchGbicPortService.updateLeafSwitchGbicPort(
          deleteDialog.value.leafSwitchGbicPortId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchLeafSwitchGbicPorts();  // Fetch updated data
    emit("leafSwitchGbicPort-updated");  // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} leaf switch GBIC port:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedLeafSwitchGbicPorts.value.length > 0) {
          for (const leafSwitchGbicPort of selectedLeafSwitchGbicPorts.value) {
            await leafSwitchGbicPortService.deleteLeafSwitchGbicPort(leafSwitchGbicPort.id);
          }
          selectedLeafSwitchGbicPorts.value = [];
        } else if (deleteDialog.value.leafSwitchGbicPortId) {
          await leafSwitchGbicPortService.deleteLeafSwitchGbicPort(deleteDialog.value.leafSwitchGbicPortId);
        }
        await fetchLeafSwitchGbicPorts();
        emit("leafSwitchGbicPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete leafSwitchGbicPort(s):", error);
      }
    };

    onMounted(() => {
      fetchLeafSwitchGbicPorts();
    });

    return {
      loading,
      leafSwitchGbicPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedLeafSwitchGbicPorts,
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