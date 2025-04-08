<template>
  <div
    class="superSpineSwitchPort-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      SuperSpineSwitchPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="SuperSpineSwitchPort"
      v-model:search-term="filter"
      :has-selected="selectedSuperSpineSwitchPorts.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="superSpineSwitchPorts"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedSuperSpineSwitchPorts"
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
          v-model.trim="form.nameOfFiberPortsToSpine"
          label="Nameoffiberportstospine"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfFiberPortsToSpine is required']"
          placeholder="Enter nameoffiberportstospine"
        />

        <q-input
          v-model.trim="form.nameOfFiberPortsToNetworkRoom"
          label="Nameoffiberportstonetworkroom"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfFiberPortsToNetworkRoom is required']"
          placeholder="Enter nameoffiberportstonetworkroom"
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
import { SuperSpineSwitchPort } from "src/types/models";
import { superSpineSwitchPortService } from "../../services/superSpineSwitchPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SuperSpineSwitchPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["superSpineSwitchPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const superSpineSwitchPorts = ref<SuperSpineSwitchPort[]>([]);
    const filter = ref("");
    const selectedSuperSpineSwitchPorts = ref<SuperSpineSwitchPort[]>([]);

    const columns = [
      {
        name: "nameOfFiberPortsToSpine",
        required: true,
        label: "Nameoffiberportstospine",
        align: "left" as "left",
        field: "nameOfFiberPortsToSpine",
        sortable: true,
      },{
        name: "nameOfFiberPortsToNetworkRoom",
        required: true,
        label: "Nameoffiberportstonetworkroom",
        align: "left" as "left",
        field: "nameOfFiberPortsToNetworkRoom",
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
      superSpineSwitchPortId: null as number | null,
    });

    const form = ref<Partial<SuperSpineSwitchPort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSuperSpineSwitchPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedSuperSpineSwitchPorts.value.length} superSpineSwitchPort(s)?`
        : "Are you sure you want to delete this superSpineSwitchPort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchSuperSpineSwitchPorts = async () => {
      loading.value = true;
      try {
        superSpineSwitchPorts.value = await superSpineSwitchPortService.
        getSuperSpineSwitchPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch superSpineSwitchPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New SuperSpineSwitchPort",
        mode: "create",
      };
    };

    const openEditDialog = (superSpineSwitchPort: SuperSpineSwitchPort) => {
      form.value = { ...superSpineSwitchPort };
      dialog.value = {
        show: true,
        title: "Edit SuperSpineSwitchPort",
        mode: "edit",
      };
      deleteDialog.value.superSpineSwitchPortId = superSpineSwitchPort.id;
    };

    const confirmDelete = (superSpineSwitchPortId: number) => {
      deleteDialog.value = {
        show: true,
        superSpineSwitchPortId: superSpineSwitchPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      nameOfFiberPortsToSpine: form.value.nameOfFiberPortsToSpine,
      nameOfFiberPortsToNetworkRoom: form.value.nameOfFiberPortsToNetworkRoom,
      sideAInstalledOnLeft: form.value.sideAInstalledOnLeft,
      sideBInstalledOnLeft: form.value.sideBInstalledOnLeft,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await superSpineSwitchPortService.createSuperSpineSwitchPort(submitData);
    } else {
      if (deleteDialog.value.superSpineSwitchPortId) {
        await superSpineSwitchPortService.updateSuperSpineSwitchPort(
          deleteDialog.value.superSpineSwitchPortId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchSuperSpineSwitchPorts(); // Fetch updated data
    emit("superSpineSwitchPort-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} super spine switch port:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedSuperSpineSwitchPorts.value.length > 0) {
          for (const superSpineSwitchPort of selectedSuperSpineSwitchPorts.value) {
            await superSpineSwitchPortService.deleteSuperSpineSwitchPort(superSpineSwitchPort.id);
          }
          selectedSuperSpineSwitchPorts.value = [];
        } else if (deleteDialog.value.superSpineSwitchPortId) {
          await superSpineSwitchPortService.deleteSuperSpineSwitchPort(deleteDialog.value.superSpineSwitchPortId);
        }
        await fetchSuperSpineSwitchPorts();
        emit("superSpineSwitchPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete superSpineSwitchPort(s):", error);
      }
    };

    onMounted(() => {
      fetchSuperSpineSwitchPorts();
    });

    return {
      loading,
      superSpineSwitchPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedSuperSpineSwitchPorts,
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