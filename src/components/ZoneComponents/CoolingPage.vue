<template>
  <div
    class="cooling-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Coolings
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="Cooling"
      v-model:search-term="filter"
      :has-selected="selectedCoolings.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="coolings"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedCoolings"
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
          v-model.trim="form.coolingType"
          label="Coolingtype"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'coolingType is required']"
          placeholder="Enter coolingtype"
        />

        <q-input
          v-model.number.trim="form.coolingAmountPerRack"
          label="Coolingamountperrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'coolingAmountPerRack is required']"
          placeholder="Enter coolingamountperrack"
        />

        <q-input
          v-model.number.trim="form.kwhConsumptionPerRack"
          label="Kwhconsumptionperrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'kwhConsumptionPerRack is required']"
          placeholder="Enter kwhconsumptionperrack"
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
import { Cooling } from "src/types/models";
import { coolingService } from "../../services/coolingService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "CoolingManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["cooling-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const coolings = ref<Cooling[]>([]);
    const filter = ref("");
    const selectedCoolings = ref<Cooling[]>([]);

    const columns = [
      {
        name: "coolingType",
        required: true,
        label: "Coolingtype",
        align: "left" as "left",
        field: "coolingType",
        sortable: true,
      },{
        name: "coolingAmountPerRack",
        required: true,
        label: "Coolingamountperrack",
        align: "left" as "left",
        field: "coolingAmountPerRack",
        sortable: true,
      },{
        name: "kwhConsumptionPerRack",
        required: true,
        label: "Kwhconsumptionperrack",
        align: "left" as "left",
        field: "kwhConsumptionPerRack",
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
      coolingId: null as number | null,
    });

    const form = ref<Partial<Cooling>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedCoolings.value.length > 0
        ? `Are you sure you want to delete ${selectedCoolings.value.length} cooling(s)?`
        : "Are you sure you want to delete this cooling?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchCoolings = async () => {
      loading.value = true;
      try {
        coolings.value = await coolingService.
        getCoolingsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch coolings:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Cooling",
        mode: "create",
      };
    };

    const openEditDialog = (cooling: Cooling) => {
      form.value = { ...cooling };
      dialog.value = {
        show: true,
        title: "Edit Cooling",
        mode: "edit",
      };
      deleteDialog.value.coolingId = cooling.id;
    };

    const confirmDelete = (coolingId: number) => {
      deleteDialog.value = {
        show: true,
        coolingId: coolingId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };
    const handleSubmit = async () => {
  try {
    const submitData = {
      coolingType: form.value.coolingType,
      coolingAmountPerRack: Number(form.value.coolingAmountPerRack),
      kwhConsumptionPerRack: Number(form.value.kwhConsumptionPerRack),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await coolingService.createCooling(submitData);
    } else {
      if (deleteDialog.value.coolingId) {
        await coolingService.updateCooling(deleteDialog.value.coolingId, submitData);
      }
    }

    dialog.value.show = false;
    await fetchCoolings(); // Fetch updated Cooling data
    emit("cooling-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} cooling entry:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedCoolings.value.length > 0) {
          for (const cooling of selectedCoolings.value) {
            await coolingService.deleteCooling(cooling.id);
          }
          selectedCoolings.value = [];
        } else if (deleteDialog.value.coolingId) {
          await coolingService.deleteCooling(deleteDialog.value.coolingId);
        }
        await fetchCoolings();
        emit("cooling-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete cooling(s):", error);
      }
    };

    onMounted(() => {
      fetchCoolings();
    });

    return {
      loading,
      coolings,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedCoolings,
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