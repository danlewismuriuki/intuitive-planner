<template>
  <div
    class="superSpineSwitchRack-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      SuperSpineSwitchRacks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="SuperSpineSwitchRack"
      v-model:search-term="filter"
      :has-selected="selectedSuperSpineSwitchRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="superSpineSwitchRacks"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedSuperSpineSwitchRacks"
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
import { SuperSpineSwitchRack } from "src/types/models";
import { superSpineSwitchRackService } from "../../services/superSpineSwitchRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SuperSpineSwitchRackManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["superSpineSwitchRack-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const superSpineSwitchRacks = ref<SuperSpineSwitchRack[]>([]);
    const filter = ref("");
    const selectedSuperSpineSwitchRacks = ref<SuperSpineSwitchRack[]>([]);

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
      superSpineSwitchRackId: null as number | null,
    });

    const form = ref<Partial<SuperSpineSwitchRack>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSuperSpineSwitchRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedSuperSpineSwitchRacks.value.length} superSpineSwitchRack(s)?`
        : "Are you sure you want to delete this superSpineSwitchRack?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchSuperSpineSwitchRacks = async () => {
      loading.value = true;
      try {
        superSpineSwitchRacks.value = await superSpineSwitchRackService.
        getSuperSpineSwitchRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch superSpineSwitchRacks:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New SuperSpineSwitchRack",
        mode: "create",
      };
    };

    const openEditDialog = (superSpineSwitchRack: SuperSpineSwitchRack) => {
      form.value = { ...superSpineSwitchRack };
      dialog.value = {
        show: true,
        title: "Edit SuperSpineSwitchRack",
        mode: "edit",
      };
      deleteDialog.value.superSpineSwitchRackId = superSpineSwitchRack.id;
    };

    const confirmDelete = (superSpineSwitchRackId: number) => {
      deleteDialog.value = {
        show: true,
        superSpineSwitchRackId: superSpineSwitchRackId,
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
    //       await superSpineSwitchRackService.createSuperSpineSwitchRack(createData);
    //     } else {
    //       if (deleteDialog.value.superSpineSwitchRackId) {
    //         const updateData = {
    //           ...form.value,
    //           customerId: Number(form.value.customerId),
    //           dataHallId: Number(form.value.dataHallId),
    //         };
    //         await superSpineSwitchRackService.updateSuperSpineSwitchRack(deleteDialog.value.superSpineSwitchRackId, updateData);
    //       }
    //     }
    //     dialog.value.show = false;
    //     await fetchSuperSpineSwitchRacks();
    //     emit("superSpineSwitchRack-updated");
    //   } catch (error) {
    //     console.error(`Failed to ${dialog.value.mode} superSpineSwitchRack:`, error);
    //   }
    // };

    const handleSubmit = async () => {
  try {
    const submitData = {
      name: form.value.name,
      containsFiberPatchPanel: Boolean(form.value.containsFiberPatchPanel),
      containsCopperPatchPanel: Boolean(form.value.containsCopperPatchPanel),
      numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels),
      numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels),
      numberOfSpineSwitchesPerRack: Number(form.value.numberOfSpineSwitchesPerRack),
      customerId: Number(form.value.customerId),
      dataHallId: Number(form.value.dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await superSpineSwitchRackService.createSuperSpineSwitchRack(submitData);
    } else {
      if (deleteDialog.value.superSpineSwitchRackId) {
        await superSpineSwitchRackService.updateSuperSpineSwitchRack(
          deleteDialog.value.superSpineSwitchRackId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchSuperSpineSwitchRacks(); // Fetch updated data
    emit("superSpineSwitchRack-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} super spine switch rack:`, error);
  }
};

    const handleDelete = async () => {
      try {
        if (selectedSuperSpineSwitchRacks.value.length > 0) {
          for (const superSpineSwitchRack of selectedSuperSpineSwitchRacks.value) {
            await superSpineSwitchRackService.deleteSuperSpineSwitchRack(superSpineSwitchRack.id);
          }
          selectedSuperSpineSwitchRacks.value = [];
        } else if (deleteDialog.value.superSpineSwitchRackId) {
          await superSpineSwitchRackService.deleteSuperSpineSwitchRack(deleteDialog.value.superSpineSwitchRackId);
        }
        await fetchSuperSpineSwitchRacks();
        emit("superSpineSwitchRack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete superSpineSwitchRack(s):", error);
      }
    };

    onMounted(() => {
      fetchSuperSpineSwitchRacks();
    });

    return {
      loading,
      superSpineSwitchRacks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedSuperSpineSwitchRacks,
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