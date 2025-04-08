<template>
  <div
    class="connectivityPath-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      ConnectivityPaths
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="ConnectivityPath"
      v-model:search-term="filter"
      :has-selected="selectedConnectivityPaths.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="connectivityPaths"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedConnectivityPaths"
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
          v-model.trim="form.pathName"
          label="Pathname"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'pathName is required']"
          placeholder="Enter pathname"
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
import { ConnectivityPath } from "src/types/models";
import { connectivityPathService } from "../../services/connectivityPathService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ConnectivityPathManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["connectivityPath-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const connectivityPaths = ref<ConnectivityPath[]>([]);
    const filter = ref("");
    const selectedConnectivityPaths = ref<ConnectivityPath[]>([]);

    const columns = [
      {
        name: "pathName",
        required: true,
        label: "Pathname",
        align: "left" as "left",
        field: "pathName",
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
      connectivityPathId: null as number | null,
    });

    const form = ref<Partial<ConnectivityPath>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedConnectivityPaths.value.length > 0
        ? `Are you sure you want to delete ${selectedConnectivityPaths.value.length} connectivityPath(s)?`
        : "Are you sure you want to delete this connectivityPath?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchConnectivityPaths = async () => {
      loading.value = true;
      try {
        connectivityPaths.value = await connectivityPathService.
        getConnectivityPathsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch connectivityPaths:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New ConnectivityPath",
        mode: "create",
      };
    };

    const openEditDialog = (connectivityPath: ConnectivityPath) => {
      form.value = { ...connectivityPath };
      dialog.value = {
        show: true,
        title: "Edit ConnectivityPath",
        mode: "edit",
      };
      deleteDialog.value.connectivityPathId = connectivityPath.id;
    };

    const confirmDelete = (connectivityPathId: number) => {
      deleteDialog.value = {
        show: true,
        connectivityPathId: connectivityPathId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      pathName: form.value.pathName,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await connectivityPathService.createConnectivityPath(submitData);
    } else {
      if (deleteDialog.value.connectivityPathId) {
        await connectivityPathService.updateConnectivityPath(
          deleteDialog.value.connectivityPathId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchConnectivityPaths(); // Fetch updated ConnectivityPath data
    emit("connectivityPath-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} connectivity path:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedConnectivityPaths.value.length > 0) {
          for (const connectivityPath of selectedConnectivityPaths.value) {
            await connectivityPathService.deleteConnectivityPath(connectivityPath.id);
          }
          selectedConnectivityPaths.value = [];
        } else if (deleteDialog.value.connectivityPathId) {
          await connectivityPathService.deleteConnectivityPath(deleteDialog.value.connectivityPathId);
        }
        await fetchConnectivityPaths();
        emit("connectivityPath-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete connectivityPath(s):", error);
      }
    };

    onMounted(() => {
      fetchConnectivityPaths();
    });

    return {
      loading,
      connectivityPaths,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedConnectivityPaths,
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