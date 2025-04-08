<template>
  <div
    class="networkTypeSouth-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      NetworkTypeSouth
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="NetworkTypeSouth"
      v-model:search-term="filter"
      :has-selected="selectedNetworkTypeSouths.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="networkTypeSouths"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedNetworkTypeSouths"
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
          v-model.trim="form.name"
          label="Name"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberGbicPorts"
          label="Numberoffibergbicports"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberGbicPorts is required']"
          placeholder="Enter numberoffibergbicports"
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
import { NetworkTypeSouth } from "src/types/models";
import { networkTypeSouthService } from "../../services/networkTypeSouthService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "NetworkTypeSouthManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["networkTypeSouth-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const networkTypeSouths = ref<NetworkTypeSouth[]>([]);
    const filter = ref("");
    const selectedNetworkTypeSouths = ref<NetworkTypeSouth[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      },{
        name: "numberOfFiberGbicPorts",
        required: true,
        label: "Numberoffibergbicports",
        align: "left" as "left",
        field: "numberOfFiberGbicPorts",
        sortable: true,
      },{
        name: "numberOfFiberPortsPerGbic",
        required: true,
        label: "Numberoffiberportspergbic",
        align: "left" as "left",
        field: "numberOfFiberPortsPerGbic",
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
      networkTypeSouthId: null as number | null,
    });

    const form = ref<Partial<NetworkTypeSouth>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedNetworkTypeSouths.value.length > 0
        ? `Are you sure you want to delete ${selectedNetworkTypeSouths.value.length} networkTypeSouth(s)?`
        : "Are you sure you want to delete this networkTypeSouth?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchNetworkTypeSouths = async () => {
      loading.value = true;
      try {
        networkTypeSouths.value = await networkTypeSouthService.
        getNetworkTypeSouthsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch networkTypeSouths:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New NetworkTypeSouth",
        mode: "create",
      };
    };

    const openEditDialog = (networkTypeSouth: NetworkTypeSouth) => {
      form.value = { ...networkTypeSouth };
      dialog.value = {
        show: true,
        title: "Edit NetworkTypeSouth",
        mode: "edit",
      };
      deleteDialog.value.networkTypeSouthId = networkTypeSouth.id;
    };

    const confirmDelete = (networkTypeSouthId: number) => {
      deleteDialog.value = {
        show: true,
        networkTypeSouthId: networkTypeSouthId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      name: form.value.name,
      numberOfFiberGbicPorts: Number(form.value.numberOfFiberGbicPorts),
      numberOfFiberPortsPerGbic: Number(form.value.numberOfFiberPortsPerGbic),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId)
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await networkTypeSouthService.createNetworkTypeSouth(submitData);
    } else {
      if (deleteDialog.value.networkTypeSouthId) {
        await networkTypeSouthService.updateNetworkTypeSouth(
          deleteDialog.value.networkTypeSouthId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchNetworkTypeSouths(); // Fetch updated data
    emit("networkTypeSouth-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} network type south:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedNetworkTypeSouths.value.length > 0) {
          for (const networkTypeSouth of selectedNetworkTypeSouths.value) {
            await networkTypeSouthService.deleteNetworkTypeSouth(networkTypeSouth.id);
          }
          selectedNetworkTypeSouths.value = [];
        } else if (deleteDialog.value.networkTypeSouthId) {
          await networkTypeSouthService.deleteNetworkTypeSouth(deleteDialog.value.networkTypeSouthId);
        }
        await fetchNetworkTypeSouths();
        emit("networkTypeSouth-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete networkTypeSouth(s):", error);
      }
    };

    onMounted(() => {
      fetchNetworkTypeSouths();
    });

    return {
      loading,
      networkTypeSouths,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedNetworkTypeSouths,
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