<template>
  <div class="building-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Building(s) for {{ customerName }}
    </div>

    <!-- Search and Actions Row -->
    <SearchHeader v-model:searchTerm="searchTerm" item-name="Building" :hasSelected="selectedBuildings.length > 0"
      @add="openAddBuildingDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Table Section -->
    <DataTable :rows="filteredBuildings" :columns="columns" :loading="loading" v-model:selected="selectedBuildings"
      @row-click="goToFloors" @edit="openEditBuildingDialog" @delete="confirmDeleteSingle" />

    <!-- Add/Edit Form Dialog -->
    <FormDialog v-model="buildingDialog" :title="editingBuilding ? 'Edit Building' : 'Add Building'"
      :is-valid="!!buildingForm.name && !!buildingForm.siteId" @save="saveBuilding" @cancel="buildingDialog = false">
      <q-input v-model="buildingForm.name" label="Name" dark outlined class="q-mb-md"
        :rules="[(val) => !!val || 'Name is required']" />
      <q-select v-model="buildingForm.siteId" :options="siteOptions" label="Select Site" option-value="id"
        option-label="name" map-options emit-value dark outlined class="q-mb-md"
        :rules="[(val) => !!val || 'Site is required']" />
    </FormDialog>

    <!-- Delete Confirmation Dialog -->
    <ConfirmationDialog v-model="deleteConfirmDialog" :message="deleteConfirmMessage" @confirm="executeDelete" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Building } from "src/types/models";
import { buildingService} from "../../services/buildingService";
import { customerService } from "../../services/customerService";
import { siteService } from "../../services/siteService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

interface SiteOption {
  id: number;
  name: string;
}

export default defineComponent({
  name: "BuildingList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const customerName = ref("");
    const buildings = ref<Building[]>([]);
    const loading = ref(false);
    const buildingDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingBuilding = ref<Building | null>(null);
    const searchTerm = ref("");
    const selectedBuildings = ref<Building[]>([]);
    const deleteConfirmMessage = ref("");
    const deleteMode = ref<"single" | "multiple">("single");
    const singleDeleteId = ref<number | null>(null);
    const siteOptions = ref<SiteOption[]>([]);

    const buildingForm = ref({
      name: "",
      siteId: null as number | null,
    });

    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "name", label: "Name", field: "name", sortable: true },
      {
        name: "siteName",
        label: "Site",
        field: (row: Building) => row.site?.name || "N/A",
        sortable: true,
      },
    ];

    const filteredBuildings = computed(() => {
      return buildings.value.filter((building) =>
        building.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const fetchBuildings = async () => {
      loading.value = true;
      try {
        buildings.value = await buildingService.getBuildingsByCustomerId(
          props.customerId
        );
      } catch (error) {
        console.error("Failed to fetch buildings:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCustomerName = async () => {
      try {
        const customer = await customerService.getCustomerById(props.customerId);
        customerName.value = customer.name;
      } catch (error) {
        console.error("Failed to fetch customer name:", error);
      }
    };

    const fetchSites = async () => {
      try {
        const sites = await siteService.getSitesByCustomerId(props.customerId);
        siteOptions.value = sites.map((site) => ({
          id: site.id,
          name: site.name,
        }));
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      }
    };

    const openAddBuildingDialog = () => {
      editingBuilding.value = null;
      buildingForm.value = {
        name: "",
        siteId: null,
      };
      buildingDialog.value = true;
    };

    const openEditBuildingDialog = (building: Building) => {
      editingBuilding.value = building;
      buildingForm.value = {
        name: building.name,
        siteId: building.siteId,
      };
      buildingDialog.value = true;
    };

    const saveBuilding = async () => {
  try {
    // Validate buildingForm data
    if (!buildingForm.value.name || !buildingForm.value.siteId) {
      throw new Error("Please fill in all required fields: Name and Site.");
    }

    // Ensure that siteId is valid and not null
    const buildingData = {
      ...buildingForm.value,
      customerId: props.customerId,
      siteId: buildingForm.value.siteId!,
    };

    // Create or update building based on whether we're editing or adding a new one
    if (editingBuilding.value) {
      await buildingService.updateBuilding(editingBuilding.value.id, buildingData);
    } else {
      await buildingService.createBuilding(buildingData);
    }

    // Fetch the latest buildings after the operation
    await fetchBuildings();

    // Close the dialog and emit a successful update
    buildingDialog.value = false;
    emit("building-updated");
  } catch (error) {
    console.error("Failed to save building:", error);
    // Optionally show a user-friendly error message here
    alert("An error occurred while saving the building.");
  }
};


    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = "single";
      singleDeleteId.value = id;
      deleteConfirmMessage.value =
        "Are you sure you want to delete this building?";
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = "multiple";
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedBuildings.value.length} building(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === "single" && singleDeleteId.value !== null) {
        await deleteSingleBuilding(singleDeleteId.value);
      } else if (deleteMode.value === "multiple") {
        await deleteSelectedBuildings();
      }
    };

    const deleteSingleBuilding = async (id: number) => {
      try {
        await buildingService.deleteBuilding(id);
        await fetchBuildings();
        emit("building-updated");
      } catch (error) {
        console.error("Failed to delete building:", error);
      }
    };

    const deleteSelectedBuildings = async () => {
      try {
        for (const building of selectedBuildings.value) {
          await buildingService.deleteBuilding(building.id);
        }
        await fetchBuildings();
        selectedBuildings.value = [];
        emit("building-updated");
      } catch (error) {
        console.error("Failed to delete selected buildings:", error);
      }
    };

    const goToFloors = (buildingId: number) => {
      if (selectedBuildings.value.length === 0) {
        router.push({
          name: "FloorList",
          params: { buildingId: buildingId.toString() },
        });
      }
    };

    onMounted(() => {
      fetchBuildings();
      fetchCustomerName();
      fetchSites();
    });

    watch(
      () => props.customerId,
      () => {
        fetchBuildings();
        fetchCustomerName();
        fetchSites();
      }
    );

    return {
      customerName,
      buildings,
      filteredBuildings,
      columns,
      loading,
      buildingDialog,
      deleteConfirmDialog,
      deleteConfirmMessage,
      buildingForm,
      editingBuilding,
      searchTerm,
      selectedBuildings,
      siteOptions,
      openAddBuildingDialog,
      openEditBuildingDialog,
      saveBuilding,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      goToFloors,
    };
  },
});
</script>

<style lang="scss" scoped>
.building-management {

  .q-input,
  .q-select {
    .q-field__control {
      background: rgba(255, 255, 255, 0.05);
    }

    .q-field__label {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
