<template>
  <div class="rackType-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      RackTypes
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="RackType" v-model:search-term="filter" :has-selected="selectedRackTypes.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="rackTypes" :columns="columns" :loading="loading" v-model:selected="selectedRackTypes"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined type="text" required
          :rules="[(val) => !!val || 'name is required']" placeholder="Enter name" />
      </q-form>
    </FormDialog>

    <!-- Confirmation Dialog Component -->
    <ConfirmationDialog v-model="deleteDialog.show" :message="deleteConfirmMessage" confirm-label="DELETE"
      @confirm="handleDelete" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { RackType } from "src/types/models";
import { rackTypeService } from "../../services/rackTypeService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "RackTypeManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["rackType-updated"],
  setup(_, { emit }) {
    const loading = ref(false);
    const rackTypes = ref<RackType[]>([]);
    const filter = ref("");
    const selectedRackTypes = ref<RackType[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
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
      rackTypeId: null as number | null,
    });

    const form = ref<Partial<RackType>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedRackTypes.value.length > 0
        ? `Are you sure you want to delete ${selectedRackTypes.value.length} rackType(s)?`
        : "Are you sure you want to delete this rackType?";
    });

    const resetFormData = () => {
      form.value = {};
    };

    const fetchRackTypes = async () => {
      loading.value = true;
      try {
        rackTypes.value = await rackTypeService.getAllRackTypes();
      } catch (error) {
        console.error("Failed to fetch rackTypes:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New RackType",
        mode: "create",
      };
    };

    const openEditDialog = (rackType: RackType) => {
      form.value = { ...rackType };
      dialog.value = {
        show: true,
        title: "Edit RackType",
        mode: "edit",
      };
      deleteDialog.value.rackTypeId = rackType.id;
    };

    const confirmDelete = (rackTypeId: number) => {
      deleteDialog.value = {
        show: true,
        rackTypeId: rackTypeId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (dialog.value.mode === "create") {
          const createData = {
            ...form.value,
          };
          await rackTypeService.createRackType(createData);
        } else {
          if (deleteDialog.value.rackTypeId) {
            const updateData = {
              ...form.value,
            };
            await rackTypeService.updateRackType(
              deleteDialog.value.rackTypeId,
              updateData
            );
          }
        }
        dialog.value.show = false;
        await fetchRackTypes();
        emit("rackType-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} rackType:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedRackTypes.value.length > 0) {
          for (const rackType of selectedRackTypes.value) {
            await rackTypeService.deleteRackType(rackType.id);
          }
          selectedRackTypes.value = [];
        } else if (deleteDialog.value.rackTypeId) {
          await rackTypeService.deleteRackType(deleteDialog.value.rackTypeId);
        }
        await fetchRackTypes();
        emit("rackType-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete rackType(s):", error);
      }
    };

    onMounted(() => {
      fetchRackTypes();
    });

    return {
      loading,
      rackTypes,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedRackTypes,
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
