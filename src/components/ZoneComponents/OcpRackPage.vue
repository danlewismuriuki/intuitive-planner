<template>
  <div class="ocpRack-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      OcpRacks
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="OcpRack" v-model:search-term="filter" :has-selected="selectedOcpRacks.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="ocpRacks" :columns="columns" :loading="loading" v-model:selected="selectedOcpRacks"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

        <q-input v-model.number.trim="form.rackHeightInRackUnits" label="Rackheightinrackunits" dark outlined
          type="number" required :rules="[(val) => !!val || 'rackHeightInRackUnits is required']"
          placeholder="Enter rackheightinrackunits" />

        <q-input v-model.number.trim="form.rackWidthInMm" label="Rackwidthinmm" dark outlined type="number" required
          :rules="[(val) => !!val || 'rackWidthInMm is required']" placeholder="Enter rackwidthinmm" />

        <q-toggle v-model="form.containsFiberPatchPanel" label="Containsfiberpatchpanel" dark outlined required />

        <q-toggle v-model="form.containsCopperPatchPanel" label="Containscopperpatchpanel" dark outlined required />

        <q-input v-model.number.trim="form.numberOfFiberPatchPanels" label="Numberoffiberpatchpanels" dark outlined
          type="number" required :rules="[(val) => !!val || 'numberOfFiberPatchPanels is required']"
          placeholder="Enter numberoffiberpatchpanels" />

        <q-input v-model.number.trim="form.numberOfCopperPatchPanels" label="Numberofcopperpatchpanels" dark outlined
          type="number" required :rules="[(val) => !!val || 'numberOfCopperPatchPanels is required']"
          placeholder="Enter numberofcopperpatchpanels" />

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
import { OcpRack } from "src/types/models";
import { ocpRackService } from "../../services/ocpRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "OcpRackManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["ocpRack-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const ocpRacks = ref<OcpRack[]>([]);
    const filter = ref("");
    const selectedOcpRacks = ref<OcpRack[]>([]);

    const columns = [
      {
        name: "rackHeightInRackUnits",
        required: true,
        label: "Rackheightinrackunits",
        align: "left" as "left",
        field: "rackHeightInRackUnits",
        sortable: true,
      }, {
        name: "rackWidthInMm",
        required: true,
        label: "Rackwidthinmm",
        align: "left" as "left",
        field: "rackWidthInMm",
        sortable: true,
      }, {
        name: "containsFiberPatchPanel",
        required: true,
        label: "Containsfiberpatchpanel",
        align: "left" as "left",
        field: "containsFiberPatchPanel",
        sortable: true,
      }, {
        name: "containsCopperPatchPanel",
        required: true,
        label: "Containscopperpatchpanel",
        align: "left" as "left",
        field: "containsCopperPatchPanel",
        sortable: true,
      }, {
        name: "numberOfFiberPatchPanels",
        required: true,
        label: "Numberoffiberpatchpanels",
        align: "left" as "left",
        field: "numberOfFiberPatchPanels",
        sortable: true,
      }, {
        name: "numberOfCopperPatchPanels",
        required: true,
        label: "Numberofcopperpatchpanels",
        align: "left" as "left",
        field: "numberOfCopperPatchPanels",
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
      ocpRackId: null as number | null,
    });

    const form = ref<Partial<OcpRack>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedOcpRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedOcpRacks.value.length} ocpRack(s)?`
        : "Are you sure you want to delete this ocpRack?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchOcpRacks = async () => {
      loading.value = true;
      try {
        ocpRacks.value = await ocpRackService.getOcpRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch ocpRacks:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New OcpRack",
        mode: "create",
      };
    };

    const openEditDialog = (ocpRack: OcpRack) => {
      form.value = { ...ocpRack };
      dialog.value = {
        show: true,
        title: "Edit OcpRack",
        mode: "edit",
      };
      deleteDialog.value.ocpRackId = ocpRack.id;
    };

    const confirmDelete = (ocpRackId: number) => {
      deleteDialog.value = {
        show: true,
        ocpRackId: ocpRackId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

//     const handleSubmit = async () => {
//   try {
//     const submitData = {
//       rackHeightInRackUnits: Number(form.value.rackHeightInRackUnits),
//       rackWidthInMm: Number(form.value.rackWidthInMm),
//       containsFiberPatchPanel: form.value.containsFiberPatchPanel,
//       containsCopperPatchPanel: form.value.containsCopperPatchPanel,
//       numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels),
//       numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels),
//       customerId: Number(customerId),
//       dataHallId: Number(dataHallId)
//     };

//     // Handle create or update based on the mode
//     if (dialog.value.mode === "create") {
//       await ocpRackService.createOcpRack(submitData);
//     } else {
//       if (deleteDialog.value.ocpRackId) {
//         await ocpRackService.updateOcpRack(deleteDialog.value.ocpRackId, submitData);
//       }
//     }

//     dialog.value.show = false;
//     await fetchOcpRacks(); // Fetch updated data
//     emit("ocpRack-updated"); // Emit update event
//   } catch (error) {
//     console.error(`Failed to ${dialog.value.mode} OCP rack:`, error);
//   }
// };
const handleSubmit = async () => {
  try {
    // Prepare the data to be submitted
    const submitData = {
      rackHeightInRackUnits: Number(form.value.rackHeightInRackUnits),
      rackWidthInMm: Number(form.value.rackWidthInMm),
      containsFiberPatchPanel: form.value.containsFiberPatchPanel,
      containsCopperPatchPanel: form.value.containsCopperPatchPanel,
      numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels),
      numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Determine whether to create or update
    if (dialog.value.mode === "create") {
      await ocpRackService.createOcpRack(submitData); // Call the create service
    } else {
      if (deleteDialog.value.ocpRackId) {
        await ocpRackService.updateOcpRack(
          deleteDialog.value.ocpRackId,
          submitData
        ); // Call the update service
      }
    }

    // Close the dialog and fetch updated data
    dialog.value.show = false;
    await fetchOcpRacks(); // Function to refresh the list of OCP Racks
    emit("ocpRack-updated"); // Emit event to notify parent components of updates
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} OCP Rack:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedOcpRacks.value.length > 0) {
          for (const ocpRack of selectedOcpRacks.value) {
            await ocpRackService.deleteOcpRack(ocpRack.id);
          }
          selectedOcpRacks.value = [];
        } else if (deleteDialog.value.ocpRackId) {
          await ocpRackService.deleteOcpRack(deleteDialog.value.ocpRackId);
        }
        await fetchOcpRacks();
        emit("ocpRack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete ocpRack(s):", error);
      }
    };

    onMounted(() => {
      fetchOcpRacks();
    });

    return {
      loading,
      ocpRacks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedOcpRacks,
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