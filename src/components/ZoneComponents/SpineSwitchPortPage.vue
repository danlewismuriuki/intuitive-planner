<template>
  <div
    class="spineSwitchPort-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      SpineSwitchPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="SpineSwitchPort"
      v-model:search-term="filter"
      :has-selected="selectedSpineSwitchPorts.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="spineSwitchPorts"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedSpineSwitchPorts"
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
          v-model.trim="form.nameOfFiberPortsToLeaf"
          label="Nameoffiberportstoleaf"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfFiberPortsToLeaf is required']"
          placeholder="Enter nameoffiberportstoleaf"
        />

        <q-input
          v-model.trim="form.nameOfFiberPortsToSuperSpine"
          label="Nameoffiberportstosuperspine"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfFiberPortsToSuperSpine is required']"
          placeholder="Enter nameoffiberportstosuperspine"
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
import { SpineSwitchPort } from "src/types/models";
import { spineSwitchPortService } from "../../services/spineSwitchPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SpineSwitchPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["spineSwitchPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const spineSwitchPorts = ref<SpineSwitchPort[]>([]);
    const filter = ref("");
    const selectedSpineSwitchPorts = ref<SpineSwitchPort[]>([]);

    const columns = [
      {
        name: "nameOfFiberPortsToLeaf",
        required: true,
        label: "Nameoffiberportstoleaf",
        align: "left" as "left",
        field: "nameOfFiberPortsToLeaf",
        sortable: true,
      },{
        name: "nameOfFiberPortsToSuperSpine",
        required: true,
        label: "Nameoffiberportstosuperspine",
        align: "left" as "left",
        field: "nameOfFiberPortsToSuperSpine",
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
      spineSwitchPortId: null as number | null,
    });

    const form = ref<Partial<SpineSwitchPort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSpineSwitchPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedSpineSwitchPorts.value.length} spineSwitchPort(s)?`
        : "Are you sure you want to delete this spineSwitchPort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchSpineSwitchPorts = async () => {
      loading.value = true;
      try {
        spineSwitchPorts.value = await spineSwitchPortService.
        getSpineSwitchPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch spineSwitchPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New SpineSwitchPort",
        mode: "create",
      };
    };

    const openEditDialog = (spineSwitchPort: SpineSwitchPort) => {
      form.value = { ...spineSwitchPort };
      dialog.value = {
        show: true,
        title: "Edit SpineSwitchPort",
        mode: "edit",
      };
      deleteDialog.value.spineSwitchPortId = spineSwitchPort.id;
    };

    const confirmDelete = (spineSwitchPortId: number) => {
      deleteDialog.value = {
        show: true,
        spineSwitchPortId: spineSwitchPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };
    const handleSubmit = async () => {
  try {
    const submitData = {
      nameOfFiberPortsToLeaf: form.value.nameOfFiberPortsToLeaf,
      nameOfFiberPortsToSuperSpine: form.value.nameOfFiberPortsToSuperSpine,
      sideAInstalledOnLeft: form.value.sideAInstalledOnLeft,
      sideBInstalledOnLeft: form.value.sideBInstalledOnLeft,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await spineSwitchPortService.createSpineSwitchPort(submitData);
    } else {
      if (deleteDialog.value.spineSwitchPortId) {
        await spineSwitchPortService.updateSpineSwitchPort(
          deleteDialog.value.spineSwitchPortId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchSpineSwitchPorts(); // Fetch updated data
    emit("spineSwitchPort-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} spine switch port:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedSpineSwitchPorts.value.length > 0) {
          for (const spineSwitchPort of selectedSpineSwitchPorts.value) {
            await spineSwitchPortService.deleteSpineSwitchPort(spineSwitchPort.id);
          }
          selectedSpineSwitchPorts.value = [];
        } else if (deleteDialog.value.spineSwitchPortId) {
          await spineSwitchPortService.deleteSpineSwitchPort(deleteDialog.value.spineSwitchPortId);
        }
        await fetchSpineSwitchPorts();
        emit("spineSwitchPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete spineSwitchPort(s):", error);
      }
    };

    onMounted(() => {
      fetchSpineSwitchPorts();
    });

    return {
      loading,
      spineSwitchPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedSpineSwitchPorts,
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