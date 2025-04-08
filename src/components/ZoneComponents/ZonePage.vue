<template>
  <div class="zone-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Zones
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Zone" v-model:search-term="filter" :has-selected="selectedZones.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="filteredZones" :columns="columns" :loading="loading" v-model:selected="selectedZones"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined required
          :rules="[(val) => !!val || 'Name is required']" placeholder="Enter name" />

        <q-select v-model="form.zoneTypeId" :options="zoneTypeOptions" label="Zone Type" dark outlined required
          :rules="[(val) => !!val || 'Zone Type is required']" option-value="value" option-label="label" />

        <q-input v-model.number="form.numberOfScalableUnits" type="number" label="Number of Scalable Units" dark
          outlined required :rules="[(val) => val > 0 || 'Must be greater than 0']"
          placeholder="Enter number of scalable units" />

        <q-input v-model.number="form.numberOfRacks" type="number" label="Number of Racks" dark outlined required
          :rules="[(val) => val > 0 || 'Must be greater than 0']" placeholder="Enter number of racks" />

        <q-input v-model.number="form.numberOfTilesBetweenScalableUnitRows" type="number"
          label="Number of Tiles Between Scalable Unit Rows" dark outlined required
          :rules="[(val) => val >= 0 || 'Must be 0 or greater']" placeholder="Enter number of tiles between rows" />

        <q-input v-model.number="form.numberOfTilesBetwenScalableUnits" type="number"
          label="Number of Tiles Between Scalable Units" dark outlined required
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
import { Zone, ZoneType } from "src/types/models";
import { zoneService } from "src/services/zoneService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { zoneTypeService } from "src/services/zoneTypeService";

export default defineComponent({
  name: "ZoneList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["zone-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const zones = ref<Zone[]>([]);
    const zoneTypes = ref<ZoneType[]>([]);
    const filter = ref("");
    const selectedZones = ref<Zone[]>([]);

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
        name: "zoneTypeId",
        required: true,
        label: "Zone Type",
        align: "left" as "left",
        field: (row: Zone & { zoneType: { name: string } }) =>
          row.zoneType?.name || "N/A",
        sortable: true,
      },
      {
        name: "numberOfScalableUnits",
        required: true,
        label: "Number of Scalable Units",
        align: "left" as "left",
        field: "numberOfScalableUnits",
        sortable: true,
      },
      {
        name: "numberOfRacks",
        required: true,
        label: "Number of Racks",
        align: "left" as "left",
        field: "numberOfRacks",
        sortable: true,
      },
      {
        name: "numberOfTilesBetweenScalableUnitRows",
        required: true,
        label: "Number of Tiles Between Scalable Unit Rows",
        align: "left" as "left",
        field: "numberOfTilesBetweenScalableUnitRows",
        sortable: true,
      },
      {
        name: "numberOfTilesBetwenScalableUnits",
        required: true,
        label: "Number of Tiles Between Scalable Units",
        align: "left" as "left",
        field: "numberOfTilesBetwenScalableUnits",
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
      zoneId: null as number | null,
    });

    const form = ref<Partial<Zone>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedZones.value.length > 0
        ? `Are you sure you want to delete ${selectedZones.value.length} zone(s)?`
        : "Are you sure you want to delete this zone?";
    });

    const zoneTypeOptions = computed(() =>
      zoneTypes.value.map((type) => ({
        label: type.name,
        value: type.id,
      }))
    );

    // New computed property for filtered zones
    const filteredZones = computed(() => {
      if (!filter.value) return zones.value;
      const searchTerm = filter.value.toLowerCase();

      const filtered = zones.value.filter(zone =>
        zone.name.toLowerCase().includes(searchTerm)
      );

      console.log('Filtered zones:', filtered);
      return filtered;
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        numberOfScalableUnits: 0,
        numberOfRacks: 0,
        numberOfTilesBetweenScalableUnitRows: 0,
        numberOfTilesBetwenScalableUnits: 0,
      };
    };

    const fetchZones = async () => {
      loading.value = true;
      try {
        zones.value = await zoneService.getZonesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch zones:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchZoneTypes = async () => {
      try {
        zoneTypes.value = await zoneTypeService.getAllZoneTypes();
        // console.log('Fetched zone types:', zoneTypes.value);
      } catch (error) {
        console.error("Failed to fetch zone types:", error);
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Zone",
        mode: "create",
      };
    };

    const openEditDialog = (zone: Zone) => {
      form.value = { ...zone };
      dialog.value = {
        show: true,
        title: "Edit Zone",
        mode: "edit",
      };
      deleteDialog.value.zoneId = zone.id;
    };

    const confirmDelete = (zoneId: number) => {
      deleteDialog.value = {
        show: true,
        zoneId: zoneId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };
    

    const handleSubmit = async () => {
  try {
    // Ensure zoneTypeId is a number and extract the value if it's an object
    const zoneTypeIdValue = typeof form.value.zoneTypeId === 'object' ? form.value.zoneTypeId.value : form.value.zoneTypeId;

    // Check if zoneTypeId is valid (either a number or the correct value)
    if (isNaN(zoneTypeIdValue) || zoneTypeIdValue == null) {
      console.error("Invalid zoneTypeId");
      return;
    }

    const submitData = {
      name: form.value.name,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
      zoneTypeId: Number(zoneTypeIdValue),  // Use the value here
      numberOfScalableUnits: Number(form.value.numberOfScalableUnits),
      numberOfRacks: Number(form.value.numberOfRacks),
      numberOfTilesBetweenScalableUnitRows: Number(form.value.numberOfTilesBetweenScalableUnitRows),
      numberOfTilesBetwenScalableUnits: Number(form.value.numberOfTilesBetwenScalableUnits)
    };

    if (dialog.value.mode === "create") {
      await zoneService.createZone(submitData);
    } else {
      if (deleteDialog.value.zoneId) {
        await zoneService.updateZone(deleteDialog.value.zoneId, submitData);
      }
    }

    dialog.value.show = false;
    await fetchZones();
    emit("zone-updated");
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} zone:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedZones.value.length > 0) {
          for (const zone of selectedZones.value) {
            await zoneService.deleteZone(zone.id);
          }
          selectedZones.value = [];
        } else if (deleteDialog.value.zoneId) {
          await zoneService.deleteZone(deleteDialog.value.zoneId);
        }
        await fetchZones();
        emit("zone-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete zone(s):", error);
      }
    };

    onMounted(() => {
      fetchZones();
      fetchZoneTypes();
    });

    return {
      loading,
      zones,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedZones,
      deleteConfirmMessage,
      isFormValid,
      zoneTypeOptions,
      filteredZones,
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
