<template>
  <div class="rackUnit-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      RackUnits
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="RackUnit" v-model:search-term="filter" :has-selected="selectedRackUnits.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredRackUnits" :columns="columns" :loading="loading" v-model:selected="selectedRackUnits"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

        <q-input 
          v-model.trim="form.name"
          label="Name"
          dark outlined
          type="string"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name" />
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
import { RackUnit } from "src/types/models";
import { rackUnitService } from "../../services/rackUnitService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "RackUnitManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["rackUnit-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const rackUnits = ref<RackUnit[]>([]);
    const filter = ref("");
    const selectedRackUnits = ref<RackUnit[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
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
      rackUnitId: null as number | null,
    });

    const form = ref<Partial<RackUnit>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedRackUnits.value.length > 0
        ? `Are you sure you want to delete ${selectedRackUnits.value.length} rackUnit(s)?`
        : "Are you sure you want to delete this rackUnit?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchRackUnits = async () => {
      loading.value = true;
      try {
        rackUnits.value = await rackUnitService.getRackUnitsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch rackUnits:", error);
      } finally {
        loading.value = false;
      }
    };

    const filteredRackUnits = computed(() => {
      if (!filter.value) {
        return rackUnits.value; // If no filter, return all rack units
      }
      return rackUnits.value.filter((rackUnit) =>
        rackUnit.name.toLowerCase().includes(filter.value.toLowerCase())
      );
    });



    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New RackUnit",
        mode: "create",
      };
    };

    const openEditDialog = (rackUnit: RackUnit) => {
      form.value = { ...rackUnit };
      dialog.value = {
        show: true,
        title: "Edit RackUnit",
        mode: "edit",
      };
      deleteDialog.value.rackUnitId = rackUnit.id;
    };

    const confirmDelete = (rackUnitId: number) => {
      deleteDialog.value = {
        show: true,
        rackUnitId: rackUnitId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    // Prepare the data for submission
    const submitData = {
      name: form.value.name,
      customerId: Number(form.value.customerId),
      dataHallId: Number(form.value.dataHallId),
    };

    // Determine whether to create or update a rack unit
    if (dialog.value.mode === "create") {
      // Create rack unit
      await rackUnitService.createRackUnit(submitData);
    } else {
      // Update rack unit if an ID is available
      if (deleteDialog.value.rackUnitId) {
        await rackUnitService.updateRackUnit(deleteDialog.value.rackUnitId, submitData);
      } else {
        console.error("Rack unit ID is missing for update.");
        return;
      }
    }

    // Close dialog and refresh the list of rack units
    dialog.value.show = false;
    await fetchRackUnits();
    emit("rackUnit-updated");
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} rack unit:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedRackUnits.value.length > 0) {
          for (const rackUnit of selectedRackUnits.value) {
            await rackUnitService.deleteRackUnit(rackUnit.id);
          }
          selectedRackUnits.value = [];
        } else if (deleteDialog.value.rackUnitId) {
          await rackUnitService.deleteRackUnit(deleteDialog.value.rackUnitId);
        }
        await fetchRackUnits();
        emit("rackUnit-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete rackUnit(s):", error);
      }
    };

    onMounted(() => {
      fetchRackUnits();
    });

    return {
      loading,
      rackUnits,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedRackUnits,
      deleteConfirmMessage,
      isFormValid,
      filteredRackUnits,
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