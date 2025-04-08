<template>
  <div
    class="scalableUnitGpuLeafSwitchRack-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      ScalableUnitGpuLeafSwitchRacks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="ScalableUnitGpuLeafSwitchRack"
      v-model:search-term="filter"
      :has-selected="selectedScalableUnitGpuLeafSwitchRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="scalableUnitGpuLeafSwitchRacks"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedScalableUnitGpuLeafSwitchRacks"
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
          v-model.number.trim="form.numberOfSwitchesPerRack"
          label="Numberofswitchesperrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfSwitchesPerRack is required']"
          placeholder="Enter numberofswitchesperrack"
        />

        <q-input
          v-model.number.trim="form.powerLimitPerGpuSwitchRack"
          label="Powerlimitpergpuswitchrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'powerLimitPerGpuSwitchRack is required']"
          placeholder="Enter powerlimitpergpuswitchrack"
        />

        <q-toggle
          v-model="form.containsFiberPatchPanel"
          label="Containsfiberpatchpanel"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.containsCopperPatchPanel"
          label="Containscopperpatchpanel"
          dark
          outlined
          required
        />

        <q-input
          v-model.number.trim="form.numberOfFiberPatchPanels"
          label="Numberoffiberpatchpanels"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberPatchPanels is required']"
          placeholder="Enter numberoffiberpatchpanels"
        />

        <q-input
          v-model.number.trim="form.numberOfCopperPatchPanels"
          label="Numberofcopperpatchpanels"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfCopperPatchPanels is required']"
          placeholder="Enter numberofcopperpatchpanels"
        />

        <q-toggle
          v-model="form.powerFeedActive"
          label="Powerfeedactive"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.temperatureFeedActive"
          label="Temperaturefeedactive"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.waterLeakDetectionActive"
          label="Waterleakdetectionactive"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.doorAccessSensorActive"
          label="Dooraccesssensoractive"
          dark
          outlined
          required
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
import { ScalableUnitGpuLeafSwitchRack } from "src/types/models";
import { scalableUnitGpuLeafSwitchRackService } from "../../services/scalableUnitGpuLeafSwitchRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ScalableUnitGpuLeafSwitchRackManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["scalableUnitGpuLeafSwitchRack-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const scalableUnitGpuLeafSwitchRacks = ref<ScalableUnitGpuLeafSwitchRack[]>([]);
    const filter = ref("");
    const selectedScalableUnitGpuLeafSwitchRacks = ref<ScalableUnitGpuLeafSwitchRack[]>([]);

    const columns = [
      {
        name: "numberOfSwitchesPerRack",
        required: true,
        label: "Numberofswitchesperrack",
        align: "left" as "left",
        field: "numberOfSwitchesPerRack",
        sortable: true,
      },{
        name: "powerLimitPerGpuSwitchRack",
        required: true,
        label: "Powerlimitpergpuswitchrack",
        align: "left" as "left",
        field: "powerLimitPerGpuSwitchRack",
        sortable: true,
      },{
        name: "containsFiberPatchPanel",
        required: true,
        label: "Containsfiberpatchpanel",
        align: "left" as "left",
        field: "containsFiberPatchPanel",
        sortable: true,
      },{
        name: "containsCopperPatchPanel",
        required: true,
        label: "Containscopperpatchpanel",
        align: "left" as "left",
        field: "containsCopperPatchPanel",
        sortable: true,
      },{
        name: "numberOfFiberPatchPanels",
        required: true,
        label: "Numberoffiberpatchpanels",
        align: "left" as "left",
        field: "numberOfFiberPatchPanels",
        sortable: true,
      },{
        name: "numberOfCopperPatchPanels",
        required: true,
        label: "Numberofcopperpatchpanels",
        align: "left" as "left",
        field: "numberOfCopperPatchPanels",
        sortable: true,
      },{
        name: "powerFeedActive",
        required: true,
        label: "Powerfeedactive",
        align: "left" as "left",
        field: "powerFeedActive",
        sortable: true,
      },{
        name: "temperatureFeedActive",
        required: true,
        label: "Temperaturefeedactive",
        align: "left" as "left",
        field: "temperatureFeedActive",
        sortable: true,
      },{
        name: "waterLeakDetectionActive",
        required: true,
        label: "Waterleakdetectionactive",
        align: "left" as "left",
        field: "waterLeakDetectionActive",
        sortable: true,
      },{
        name: "doorAccessSensorActive",
        required: true,
        label: "Dooraccesssensoractive",
        align: "left" as "left",
        field: "doorAccessSensorActive",
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
      scalableUnitGpuLeafSwitchRackId: null as number | null,
    });

    const form = ref<Partial<ScalableUnitGpuLeafSwitchRack>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedScalableUnitGpuLeafSwitchRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedScalableUnitGpuLeafSwitchRacks.value.length} scalableUnitGpuLeafSwitchRack(s)?`
        : "Are you sure you want to delete this scalableUnitGpuLeafSwitchRack?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchScalableUnitGpuLeafSwitchRacks = async () => {
      loading.value = true;
      try {
        scalableUnitGpuLeafSwitchRacks.value = await scalableUnitGpuLeafSwitchRackService.
        getScalableUnitGpuLeafSwitchRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch scalableUnitGpuLeafSwitchRacks:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New ScalableUnitGpuLeafSwitchRack",
        mode: "create",
      };
    };

    const openEditDialog = (scalableUnitGpuLeafSwitchRack: ScalableUnitGpuLeafSwitchRack) => {
      form.value = { ...scalableUnitGpuLeafSwitchRack };
      dialog.value = {
        show: true,
        title: "Edit ScalableUnitGpuLeafSwitchRack",
        mode: "edit",
      };
      deleteDialog.value.scalableUnitGpuLeafSwitchRackId = scalableUnitGpuLeafSwitchRack.id;
    };

    const confirmDelete = (scalableUnitGpuLeafSwitchRackId: number) => {
      deleteDialog.value = {
        show: true,
        scalableUnitGpuLeafSwitchRackId: scalableUnitGpuLeafSwitchRackId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    // const handleSubmit = async () => {
    //   try {
    //     if (dialog.value.mode === "create") {
    //       const createData = {
    //         ...form.value,
    //         customerId: Number(form.value.customerId),
    //         dataHallId: Number(form.value.dataHallId),
    //       };
    //       await scalableUnitGpuLeafSwitchRackService.createScalableUnitGpuLeafSwitchRack(createData);
    //     } else {
    //       if (deleteDialog.value.scalableUnitGpuLeafSwitchRackId) {
    //         const updateData = {
    //           ...form.value,
    //           customerId: Number(form.value.customerId),
    //           dataHallId: Number(form.value.dataHallId),
    //         };
    //         await scalableUnitGpuLeafSwitchRackService.updateScalableUnitGpuLeafSwitchRack(deleteDialog.value.scalableUnitGpuLeafSwitchRackId, updateData);
    //       }
    //     }
    //     dialog.value.show = false;
    //     await fetchScalableUnitGpuLeafSwitchRacks();
    //     emit("scalableUnitGpuLeafSwitchRack-updated");
    //   } catch (error) {
    //     console.error(`Failed to ${dialog.value.mode} scalableUnitGpuLeafSwitchRack:`, error);
    //   }
    // };

    const handleSubmit = async () => {
  try {
    const submitData = {
      numberOfSwitchesPerRack: Number(form.value.numberOfSwitchesPerRack),
      powerLimitPerGpuSwitchRack: Number(form.value.powerLimitPerGpuSwitchRack),
      containsFiberPatchPanel: form.value.containsFiberPatchPanel,
      containsCopperPatchPanel: form.value.containsCopperPatchPanel,
      numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels),
      numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels),
      powerFeedActive: form.value.powerFeedActive,
      temperatureFeedActive: form.value.temperatureFeedActive,
      waterLeakDetectionActive: form.value.waterLeakDetectionActive,
      doorAccessSensorActive: form.value.doorAccessSensorActive,
      customerId: Number(customerId),
      dataHallId: Number(dataHallId)
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await scalableUnitGpuLeafSwitchRackService.createScalableUnitGpuLeafSwitchRack(submitData);
    } else {
      if (deleteDialog.value.scalableUnitGpuLeafSwitchRackId) {
        await scalableUnitGpuLeafSwitchRackService.updateScalableUnitGpuLeafSwitchRack(
          deleteDialog.value.scalableUnitGpuLeafSwitchRackId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchScalableUnitGpuLeafSwitchRacks();  // Fetch updated data
    emit("scalableUnitGpuLeafSwitchRack-updated");  // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} scalable unit GPU leaf switch rack:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedScalableUnitGpuLeafSwitchRacks.value.length > 0) {
          for (const scalableUnitGpuLeafSwitchRack of selectedScalableUnitGpuLeafSwitchRacks.value) {
            await scalableUnitGpuLeafSwitchRackService.deleteScalableUnitGpuLeafSwitchRack(scalableUnitGpuLeafSwitchRack.id);
          }
          selectedScalableUnitGpuLeafSwitchRacks.value = [];
        } else if (deleteDialog.value.scalableUnitGpuLeafSwitchRackId) {
          await scalableUnitGpuLeafSwitchRackService.deleteScalableUnitGpuLeafSwitchRack(deleteDialog.value.scalableUnitGpuLeafSwitchRackId);
        }
        await fetchScalableUnitGpuLeafSwitchRacks();
        emit("scalableUnitGpuLeafSwitchRack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete scalableUnitGpuLeafSwitchRack(s):", error);
      }
    };

    onMounted(() => {
      fetchScalableUnitGpuLeafSwitchRacks();
    });

    return {
      loading,
      scalableUnitGpuLeafSwitchRacks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedScalableUnitGpuLeafSwitchRacks,
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