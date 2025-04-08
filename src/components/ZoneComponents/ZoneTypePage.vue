<template>
  <div class="zoneType-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      ZoneTypes
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="ZoneType" v-model:search-term="filter" :has-selected="selectedZoneTypes.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredZoneTypes" :columns="columns" :loading="loading" v-model:selected="selectedZoneTypes"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined type="text" required
          :rules="[(val) => !!val || 'name is required']" placeholder="Enter name" />

        <q-input v-model.trim="form.description" label="Description" dark outlined type="text" required
          :rules="[(val) => !!val || 'description is required']" placeholder="Enter description" />
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
import { ZoneType } from "src/types/models";
import { zoneTypeService } from "../../services/zoneTypeService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ZoneTypeManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["zoneType-updated"],
  setup(_, { emit }) {
    const loading = ref(false);
    const zoneTypes = ref<ZoneType[]>([]);
    const filter = ref("");
    const selectedZoneTypes = ref<ZoneType[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      },
      {
        name: "description",
        required: true,
        label: "Description",
        align: "left" as "left",
        field: "description",
        sortable: true,
      },
    ];

    // New computed property for filtered zone types
    const filteredZoneTypes = computed(() => {
      if (!filter.value) return zoneTypes.value;
      const searchTerm = filter.value.toLowerCase();

      const filtered = zoneTypes.value.filter(zoneType =>
        zoneType.name.toLowerCase().includes(searchTerm) ||
        zoneType.description.toLowerCase().includes(searchTerm)
      );

      console.log('Filtered zone types:', filtered);
      return filtered;
    });

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      zoneTypeId: null as number | null,
    });

    const form = ref<Partial<ZoneType>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedZoneTypes.value.length > 0
        ? `Are you sure you want to delete ${selectedZoneTypes.value.length} zoneType(s)?`
        : "Are you sure you want to delete this zoneType?";
    });

    const resetFormData = () => {
      form.value = {};
    };

    const fetchZoneTypes = async () => {
      loading.value = true;
      try {
        zoneTypes.value = await zoneTypeService.getAllZoneTypes();
      } catch (error) {
        console.error("Failed to fetch zoneTypes:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New ZoneType",
        mode: "create",
      };
    };

    const openEditDialog = (zoneType: ZoneType) => {
      form.value = { ...zoneType };
      dialog.value = {
        show: true,
        title: "Edit ZoneType",
        mode: "edit",
      };
      deleteDialog.value.zoneTypeId = zoneType.id;
    };

    const confirmDelete = (zoneTypeId: number) => {
      deleteDialog.value = {
        show: true,
        zoneTypeId: zoneTypeId,
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
          await zoneTypeService.createZoneType(createData);
        } else {
          if (deleteDialog.value.zoneTypeId) {
            const updateData = {
              ...form.value,
            };
            await zoneTypeService.updateZoneType(
              deleteDialog.value.zoneTypeId,
              updateData
            );
          }
        }
        dialog.value.show = false;
        await fetchZoneTypes();
        emit("zoneType-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} zoneType:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedZoneTypes.value.length > 0) {
          for (const zoneType of selectedZoneTypes.value) {
            await zoneTypeService.deleteZoneType(zoneType.id);
          }
          selectedZoneTypes.value = [];
        } else if (deleteDialog.value.zoneTypeId) {
          await zoneTypeService.deleteZoneType(deleteDialog.value.zoneTypeId);
        }
        await fetchZoneTypes();
        emit("zoneType-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete zoneType(s):", error);
      }
    };

    onMounted(() => {
      fetchZoneTypes();
    });

    return {
      loading,
      zoneTypes,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedZoneTypes,
      deleteConfirmMessage,
      isFormValid,
      filteredZoneTypes,
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
