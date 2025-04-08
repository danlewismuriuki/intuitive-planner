<template>
  <div class="leafSwitchPort-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      LeafSwitchPorts
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="LeafSwitchPort" v-model:search-term="filter"
      :has-selected="selectedLeafSwitchPorts.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="leafSwitchPorts" :columns="columns" :loading="loading" v-model:selected="selectedLeafSwitchPorts"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

        <q-input v-model.trim="form.nameOfFiberPortsToGpu" label="Nameoffiberportstogpu" dark outlined type="string"
          required :rules="[(val) => !!val || 'nameOfFiberPortsToGpu is required']"
          placeholder="Enter nameoffiberportstogpu" />

        <q-input v-model.trim="form.nameOfFiberPortsToSpine" label="Nameoffiberportstospine" dark outlined type="string"
          required :rules="[(val) => !!val || 'nameOfFiberPortsToSpine is required']"
          placeholder="Enter nameoffiberportstospine" />

        <q-toggle v-model="form.sideAInstalledOnLeft" label="Sideainstalledonleft" dark outlined required />

        <q-toggle v-model="form.sideBInstalledOnLeft" label="Sidebinstalledonleft" dark outlined required />
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
import { LeafSwitchPort } from "src/types/models";
import { leafSwitchPortService } from "src/services/leafSwitchPortService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "LeafSwitchPortManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["leafSwitchPort-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const leafSwitchPorts = ref<LeafSwitchPort[]>([]);
    const filter = ref("");
    const selectedLeafSwitchPorts = ref<LeafSwitchPort[]>([]);

    const columns = [
      {
        name: "nameOfFiberPortsToGpu",
        required: true,
        label: "Nameoffiberportstogpu",
        align: "left" as "left",
        field: "nameOfFiberPortsToGpu",
        sortable: true,
      }, {
        name: "nameOfFiberPortsToSpine",
        required: true,
        label: "Nameoffiberportstospine",
        align: "left" as "left",
        field: "nameOfFiberPortsToSpine",
        sortable: true,
      }, {
        name: "sideAInstalledOnLeft",
        required: true,
        label: "Sideainstalledonleft",
        align: "left" as "left",
        field: "sideAInstalledOnLeft",
        sortable: true,
      }, {
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
      leafSwitchPortId: null as number | null,
    });

    const form = ref<Partial<LeafSwitchPort>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedLeafSwitchPorts.value.length > 0
        ? `Are you sure you want to delete ${selectedLeafSwitchPorts.value.length} leafSwitchPort(s)?`
        : "Are you sure you want to delete this leafSwitchPort?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchLeafSwitchPorts = async () => {
      loading.value = true;
      try {
        leafSwitchPorts.value = await leafSwitchPortService.getLeafSwitchPortsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch leafSwitchPorts:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New LeafSwitchPort",
        mode: "create",
      };
    };

    const openEditDialog = (leafSwitchPort: LeafSwitchPort) => {
      form.value = { ...leafSwitchPort };
      dialog.value = {
        show: true,
        title: "Edit LeafSwitchPort",
        mode: "edit",
      };
      deleteDialog.value.leafSwitchPortId = leafSwitchPort.id;
    };

    const confirmDelete = (leafSwitchPortId: number) => {
      deleteDialog.value = {
        show: true,
        leafSwitchPortId: leafSwitchPortId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      nameOfFiberPortsToGpu: form.value.nameOfFiberPortsToGpu,
      nameOfFiberPortsToSpine: form.value.nameOfFiberPortsToSpine,
      sideAInstalledOnLeft: form.value.sideAInstalledOnLeft,
      sideBInstalledOnLeft: form.value.sideBInstalledOnLeft,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId)
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await leafSwitchPortService.createLeafSwitchPort(submitData);
    } else {
      if (deleteDialog.value.leafSwitchPortId) {
        await leafSwitchPortService.updateLeafSwitchPort(
          deleteDialog.value.leafSwitchPortId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchLeafSwitchPorts(); // Fetch updated data
    emit("leafSwitchPort-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} leaf switch port:`, error);
  }
};



    const handleDelete = async () => {
      try {
        if (selectedLeafSwitchPorts.value.length > 0) {
          for (const leafSwitchPort of selectedLeafSwitchPorts.value) {
            await leafSwitchPortService.deleteLeafSwitchPort(leafSwitchPort.id);
          }
          selectedLeafSwitchPorts.value = [];
        } else if (deleteDialog.value.leafSwitchPortId) {
          await leafSwitchPortService.deleteLeafSwitchPort(deleteDialog.value.leafSwitchPortId);
        }
        await fetchLeafSwitchPorts();
        emit("leafSwitchPort-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete leafSwitchPort(s):", error);
      }
    };

    onMounted(() => {
      fetchLeafSwitchPorts();
    });

    return {
      loading,
      leafSwitchPorts,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedLeafSwitchPorts,
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