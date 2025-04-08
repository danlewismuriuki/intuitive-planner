<template>
  <div class="storage-unit-zone-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Storage Unit Zones
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Storage Unit Zone" v-model:search-term="filter"
      :has-selected="selectedStorageUnitZones.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="storageUnitZones" :columns="columns" :loading="loading"
      v-model:selected="selectedStorageUnitZones" @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined required
          :rules="[(val) => !!val || 'Name is required']" placeholder="Enter name" />
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
import { StorageUnitZone } from "src/types/models";
import { storageUnitZoneService } from "src/services/storageUnitZoneService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "StorageUnitZoneList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["storageUnitZone-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const storageUnitZones = ref<StorageUnitZone[]>([]);
    const filter = ref("");
    const selectedStorageUnitZones = ref<StorageUnitZone[]>([]);

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
      storageUnitZoneId: null as number | null,
    });

    const form = ref<Partial<StorageUnitZone>>({});

    const isFormValid = computed(() => {
      return !!form.value.name;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedStorageUnitZones.value.length > 0
        ? `Are you sure you want to delete ${selectedStorageUnitZones.value.length} storage unit zone(s)?`
        : "Are you sure you want to delete this storage unit zone?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        name: "",
      };
    };

    const fetchStorageUnitZones = async () => {
      loading.value = true;
      try {
        storageUnitZones.value = await storageUnitZoneService.getStorageUnitZonesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch storage unit zones:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Storage Unit Zone",
        mode: "create",
      };
    };

    const openEditDialog = (storageUnitZone: StorageUnitZone) => {
      form.value = { ...storageUnitZone };
      dialog.value = {
        show: true,
        title: "Edit Storage Unit Zone",
        mode: "edit",
      };
      deleteDialog.value.storageUnitZoneId = storageUnitZone.id;
    };

    const confirmDelete = (storageUnitZoneId: number) => {
      deleteDialog.value = {
        show: true,
        storageUnitZoneId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          name: form.value.name,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
        };

        if (dialog.value.mode === "create") {
          await storageUnitZoneService.createStorageUnitZone(submitData);
        } else {
          if (deleteDialog.value.storageUnitZoneId) {
            await storageUnitZoneService.updateStorageUnitZone(
              deleteDialog.value.storageUnitZoneId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchStorageUnitZones();
        emit("storageUnitZone-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} storage unit zone:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedStorageUnitZones.value.length > 0) {
          for (const zone of selectedStorageUnitZones.value) {
            await storageUnitZoneService.deleteStorageUnitZone(zone.id);
          }
          selectedStorageUnitZones.value = [];
        } else if (deleteDialog.value.storageUnitZoneId) {
          await storageUnitZoneService.deleteStorageUnitZone(
            deleteDialog.value.storageUnitZoneId
          );
        }
        await fetchStorageUnitZones();
        emit("storageUnitZone-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete storage unit zone(s):", error);
      }
    };

    onMounted(() => {
      fetchStorageUnitZones();
    });

    return {
      loading,
      storageUnitZones,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedStorageUnitZones,
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
