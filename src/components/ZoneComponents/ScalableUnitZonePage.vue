<template>
  <div class="scalable-unit-zone-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Scalable Unit Zones
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Scalable Unit Zone" v-model:search-term="filter"
      :has-selected="selectedScalableUnitZones.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="scalableUnitZones" :columns="columns" :loading="loading"
      v-model:selected="selectedScalableUnitZones" @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined required
          :rules="[(val) => !!val || 'Name is required']" placeholder="Enter name" />

        <q-input v-model.number="form.numberOfT1NetworkRacks" type="number" label="Number of T1 Network Racks" dark
          outlined required :rules="[(val) => val >= 0 || 'Must be 0 or greater']"
          placeholder="Enter number of T1 network racks" />

        <q-input v-model.number="form.numberOfGpuRacks" type="number" label="Number of GPU Racks" dark outlined required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']" placeholder="Enter number of GPU racks" />

        <q-input v-model.number="form.numberOfRows" type="number" label="Number of Rows" dark outlined required
          :rules="[(val) => val > 0 || 'Must be greater than 0']" placeholder="Enter number of rows" />

        <q-input v-model.number="form.numberOfTilesBetweenScalableUnitRows" type="number"
          label="Tiles Between Scalable Unit Rows" dark outlined required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']" placeholder="Enter number of tiles between rows" />

        <q-input v-model.number="form.numberOfTilesBetwenScalableUnits" type="number"
          label="Tiles Between Scalable Units" dark outlined required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']" placeholder="Enter number of tiles between units" />
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
import { ScalableUnitZone } from "src/types/models";
import { scalableUnitZoneService } from "src/services/scalableUnitZoneService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ScalableUnitZoneList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["scalableUnitZone-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const scalableUnitZones = ref<ScalableUnitZone[]>([]);
    const filter = ref("");
    const selectedScalableUnitZones = ref<ScalableUnitZone[]>([]);

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
        name: "numberOfT1NetworkRacks",
        required: true,
        label: "T1 Network Racks",
        align: "left" as "left",
        field: "numberOfT1NetworkRacks",
        sortable: true,
      },
      {
        name: "numberOfGpuRacks",
        required: true,
        label: "GPU Racks",
        align: "left" as "left",
        field: "numberOfGpuRacks",
        sortable: true,
      },
      {
        name: "numberOfRows",
        required: true,
        label: "Rows",
        align: "left" as "left",
        field: "numberOfRows",
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
      scalableUnitZoneId: null as number | null,
    });

    const form = ref<Partial<ScalableUnitZone>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedScalableUnitZones.value.length > 0
        ? `Are you sure you want to delete ${selectedScalableUnitZones.value.length} scalable unit zone(s)?`
        : "Are you sure you want to delete this scalable unit zone?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        numberOfT1NetworkRacks: 0,
        numberOfGpuRacks: 0,
        numberOfRows: 0,
        numberOfTilesBetweenScalableUnitRows: 0,
        numberOfTilesBetwenScalableUnits: 0,
      };
    };

    const fetchScalableUnitZones = async () => {
      loading.value = true;
      try {
        scalableUnitZones.value = await scalableUnitZoneService.getScalableUnitZonesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch scalable unit zones:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Scalable Unit Zone",
        mode: "create",
      };
    };

    const openEditDialog = (scalableUnitZone: ScalableUnitZone) => {
      form.value = { ...scalableUnitZone };
      dialog.value = {
        show: true,
        title: "Edit Scalable Unit Zone",
        mode: "edit",
      };
      deleteDialog.value.scalableUnitZoneId = scalableUnitZone.id;
    };

    const confirmDelete = (scalableUnitZoneId: number) => {
      deleteDialog.value = {
        show: true,
        scalableUnitZoneId,
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
          numberOfT1NetworkRacks: Number(form.value.numberOfT1NetworkRacks),
          numberOfGpuRacks: Number(form.value.numberOfGpuRacks),
          numberOfRows: Number(form.value.numberOfRows),
          numberOfTilesBetweenScalableUnitRows: Number(form.value.numberOfTilesBetweenScalableUnitRows),
          numberOfTilesBetwenScalableUnits: Number(form.value.numberOfTilesBetwenScalableUnits)
        };

        if (dialog.value.mode === "create") {
          await scalableUnitZoneService.createScalableUnitZone(submitData);
        } else {
          if (deleteDialog.value.scalableUnitZoneId) {
            await scalableUnitZoneService.updateScalableUnitZone(
              deleteDialog.value.scalableUnitZoneId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchScalableUnitZones();
        emit("scalableUnitZone-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} scalable unit zone:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedScalableUnitZones.value.length > 0) {
          for (const zone of selectedScalableUnitZones.value) {
            await scalableUnitZoneService.deleteScalableUnitZone(zone.id);
          }
          selectedScalableUnitZones.value = [];
        } else if (deleteDialog.value.scalableUnitZoneId) {
          await scalableUnitZoneService.deleteScalableUnitZone(deleteDialog.value.scalableUnitZoneId);
        }
        await fetchScalableUnitZones();
        emit("scalableUnitZone-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete scalable unit zone(s):", error);
      }
    };

    onMounted(() => {
      fetchScalableUnitZones();
    });

    return {
      loading,
      scalableUnitZones,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedScalableUnitZones,
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
