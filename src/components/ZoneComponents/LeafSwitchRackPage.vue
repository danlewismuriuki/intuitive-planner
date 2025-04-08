<template>
  <div
    class="leafSwitchRack-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      LeafSwitchRacks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="LeafSwitchRack"
      v-model:search-term="filter"
      :has-selected="selectedLeafSwitchRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="leafSwitchRacks"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedLeafSwitchRacks"
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
          v-model.trim="form.name"
          label="Name"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name"
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

        <q-input
          v-model.number.trim="form.numberOfLeafSwitchesPerRack"
          label="Numberofleafswitchesperrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfLeafSwitchesPerRack is required']"
          placeholder="Enter numberofleafswitchesperrack"
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
import { LeafSwitchRack } from "src/types/models";
import { leafSwitchRackService } from "../../services/leafSwitchRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "LeafSwitchRackManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["leafSwitchRack-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const leafSwitchRacks = ref<LeafSwitchRack[]>([]);
    const filter = ref("");
    const selectedLeafSwitchRacks = ref<LeafSwitchRack[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
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
        name: "numberOfLeafSwitchesPerRack",
        required: true,
        label: "Numberofleafswitchesperrack",
        align: "left" as "left",
        field: "numberOfLeafSwitchesPerRack",
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
      leafSwitchRackId: null as number | null,
    });

    const form = ref<Partial<LeafSwitchRack>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedLeafSwitchRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedLeafSwitchRacks.value.length} leafSwitchRack(s)?`
        : "Are you sure you want to delete this leafSwitchRack?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchLeafSwitchRacks = async () => {
      loading.value = true;
      try {
        leafSwitchRacks.value = await leafSwitchRackService
        .getLeafSwitchRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch leafSwitchRacks:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New LeafSwitchRack",
        mode: "create",
      };
    };

    const openEditDialog = (leafSwitchRack: LeafSwitchRack) => {
      form.value = { ...leafSwitchRack };
      dialog.value = {
        show: true,
        title: "Edit LeafSwitchRack",
        mode: "edit",
      };
      deleteDialog.value.leafSwitchRackId = leafSwitchRack.id;
    };

    const confirmDelete = (leafSwitchRackId: number) => {
      deleteDialog.value = {
        show: true,
        leafSwitchRackId: leafSwitchRackId,
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
      containsFiberPatchPanel: Boolean(form.value.containsFiberPatchPanel),
      containsCopperPatchPanel: Boolean(form.value.containsCopperPatchPanel),
      numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels),
      numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels),
      numberOfLeafSwitchesPerRack: Number(form.value.numberOfLeafSwitchesPerRack),
      customerId: Number(form.value.customerId),
      dataHallId: Number(form.value.dataHallId),
    };

    // Handle create or update based on the dialog mode
    if (dialog.value.mode === "create") {
      await leafSwitchRackService.createLeafSwitchRack(submitData);
    } else if (dialog.value.mode === "edit") {
      if (deleteDialog.value.leafSwitchRackId) {
        await leafSwitchRackService.updateLeafSwitchRack(
          deleteDialog.value.leafSwitchRackId,
          submitData
        );
      }
    }

    // Close the dialog and refresh data
    dialog.value.show = false;
    await fetchLeafSwitchRacks(); // Fetch updated list of racks
    emit("leafSwitchRack-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} leaf switch rack:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedLeafSwitchRacks.value.length > 0) {
          for (const leafSwitchRack of selectedLeafSwitchRacks.value) {
            await leafSwitchRackService.deleteLeafSwitchRack(leafSwitchRack.id);
          }
          selectedLeafSwitchRacks.value = [];
        } else if (deleteDialog.value.leafSwitchRackId) {
          await leafSwitchRackService.deleteLeafSwitchRack(deleteDialog.value.leafSwitchRackId);
        }
        await fetchLeafSwitchRacks();
        emit("leafSwitchRack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete leafSwitchRack(s):", error);
      }
    };

    onMounted(() => {
      fetchLeafSwitchRacks();
    });

    return {
      loading,
      leafSwitchRacks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedLeafSwitchRacks,
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