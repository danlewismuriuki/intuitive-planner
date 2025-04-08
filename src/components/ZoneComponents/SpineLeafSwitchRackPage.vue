<template>
  <div
    class="spineLeafSwitchRack-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      SpineLeafSwitchRacks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="SpineLeafSwitchRack"
      v-model:search-term="filter"
      :has-selected="selectedSpineLeafSwitchRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredSpineLeafSwitchRacks"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedSpineLeafSwitchRacks"
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
          v-model.number.trim="form.numberOfSpineSwitchesPerRack"
          label="Numberofspineswitchesperrack"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfSpineSwitchesPerRack is required']"
          placeholder="Enter numberofspineswitchesperrack"
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
import { SpineLeafSwitchRack } from "src/types/models";
import { spineLeafSwitchRackService } from "../../services/spineLeafSwitchRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SpineLeafSwitchRackManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["spineLeafSwitchRack-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const spineLeafSwitchRacks = ref<SpineLeafSwitchRack[]>([]);
    const filter = ref("");
    const selectedSpineLeafSwitchRacks = ref<SpineLeafSwitchRack[]>([]);

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
        name: "numberOfSpineSwitchesPerRack",
        required: true,
        label: "Numberofspineswitchesperrack",
        align: "left" as "left",
        field: "numberOfSpineSwitchesPerRack",
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
      spineLeafSwitchRackId: null as number | null,
    });

    const form = ref<Partial<SpineLeafSwitchRack>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSpineLeafSwitchRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedSpineLeafSwitchRacks.value.length} spineLeafSwitchRack(s)?`
        : "Are you sure you want to delete this spineLeafSwitchRack?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };


    const filteredSpineLeafSwitchRacks = computed(() => {
  return spineLeafSwitchRacks.value.filter((rack) => {
    const searchTerm = filter.value.trim().toLowerCase();

    // Combine all relevant fields into a single string
    const combinedFields = [
      rack.name.toLowerCase(),
      rack.containsFiberPatchPanel.toString(),
      rack.containsCopperPatchPanel.toString(),
      rack.numberOfFiberPatchPanels.toString(),
      rack.numberOfCopperPatchPanels.toString(),
      rack.numberOfSpineSwitchesPerRack.toString(),
    ].join(" ");

    // Return true if any of the combined fields include the search term
    return combinedFields.includes(searchTerm);
  });
});

    const fetchSpineLeafSwitchRacks = async () => {
      loading.value = true;
      try {
        spineLeafSwitchRacks.value = await spineLeafSwitchRackService.
        getSpineLeafSwitchRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch spineLeafSwitchRacks:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New SpineLeafSwitchRack",
        mode: "create",
      };
    };

    const openEditDialog = (spineLeafSwitchRack: SpineLeafSwitchRack) => {
      form.value = { ...spineLeafSwitchRack };
      dialog.value = {
        show: true,
        title: "Edit SpineLeafSwitchRack",
        mode: "edit",
      };
      deleteDialog.value.spineLeafSwitchRackId = spineLeafSwitchRack.id;
    };

    const confirmDelete = (spineLeafSwitchRackId: number) => {
      deleteDialog.value = {
        show: true,
        spineLeafSwitchRackId: spineLeafSwitchRackId,
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
            customerId: Number(form.value.customerId),
            dataHallId: Number(form.value.dataHallId),
          };
          await spineLeafSwitchRackService.createSpineLeafSwitchRack(createData);
        } else {
          if (deleteDialog.value.spineLeafSwitchRackId) {
            const updateData = {
              ...form.value,
              customerId: Number(form.value.customerId),
              dataHallId: Number(form.value.dataHallId),
            };
            await spineLeafSwitchRackService.updateSpineLeafSwitchRack(deleteDialog.value.spineLeafSwitchRackId, updateData);
          }
        }
        dialog.value.show = false;
        await fetchSpineLeafSwitchRacks();
        emit("spineLeafSwitchRack-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} spineLeafSwitchRack:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedSpineLeafSwitchRacks.value.length > 0) {
          for (const spineLeafSwitchRack of selectedSpineLeafSwitchRacks.value) {
            await spineLeafSwitchRackService.deleteSpineLeafSwitchRack(spineLeafSwitchRack.id);
          }
          selectedSpineLeafSwitchRacks.value = [];
        } else if (deleteDialog.value.spineLeafSwitchRackId) {
          await spineLeafSwitchRackService.deleteSpineLeafSwitchRack(deleteDialog.value.spineLeafSwitchRackId);
        }
        await fetchSpineLeafSwitchRacks();
        emit("spineLeafSwitchRack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete spineLeafSwitchRack(s):", error);
      }
    };

    onMounted(() => {
      fetchSpineLeafSwitchRacks();
    });

    return {
      loading,
      spineLeafSwitchRacks,
      columns,
      filter,
      dialog,
      deleteDialog,
      filteredSpineLeafSwitchRacks,
      form,
      selectedSpineLeafSwitchRacks,
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