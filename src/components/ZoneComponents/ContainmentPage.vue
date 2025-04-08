<template>
  <div
    class="containment-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Containments
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="Containment"
      v-model:search-term="filter"
      :has-selected="selectedContainments.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="containments"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedContainments"
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
          v-model.trim="form.containmentType"
          label="Containmenttype"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'containmentType is required']"
          placeholder="Enter containmenttype"
        />

        <q-input
          v-model.number.trim="form.trayWidth"
          label="Traywidth"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'trayWidth is required']"
          placeholder="Enter traywidth"
        />

        <q-input
          v-model.number.trim="form.trayLength"
          label="Traylength"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'trayLength is required']"
          placeholder="Enter traylength"
        />

        <q-input
          v-model.number.trim="form.trayHeight"
          label="Trayheight"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'trayHeight is required']"
          placeholder="Enter trayheight"
        />

        <q-input
          v-model.number.trim="form.numberOfPathwayLanes"
          label="Numberofpathwaylanes"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfPathwayLanes is required']"
          placeholder="Enter numberofpathwaylanes"
        />

        <q-input
          v-model.number.trim="form.distanceBetweenRackTypeAndFirstLane"
          label="Distancebetweenracktypeandfirstlane"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'distanceBetweenRackTypeAndFirstLane is required']"
          placeholder="Enter distancebetweenracktypeandfirstlane"
        />

        <q-input
          v-model.number.trim="form.distanceBetweenEachLaneLevel"
          label="Distancebetweeneachlanelevel"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'distanceBetweenEachLaneLevel is required']"
          placeholder="Enter distancebetweeneachlanelevel"
        />

        <q-input
          v-model.number.trim="form.startXCoordinate"
          label="Startxcoordinate"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'startXCoordinate is required']"
          placeholder="Enter startxcoordinate"
        />

        <q-input
          v-model.number.trim="form.endXCoordinate"
          label="Endxcoordinate"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'endXCoordinate is required']"
          placeholder="Enter endxcoordinate"
        />

        <q-input
          v-model.number.trim="form.startYCoordinate"
          label="Startycoordinate"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'startYCoordinate is required']"
          placeholder="Enter startycoordinate"
        />

        <q-input
          v-model.number.trim="form.endYCoordinate"
          label="Endycoordinate"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'endYCoordinate is required']"
          placeholder="Enter endycoordinate"
        />

        <q-input
          v-model.number.trim="form.costPerLength"
          label="Costperlength"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'costPerLength is required']"
          placeholder="Enter costperlength"
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
import { Containment } from "src/types/models";
import { containmentService } from "../../services/containmentService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ContainmentManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["containment-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const containments = ref<Containment[]>([]);
    const filter = ref("");
    const selectedContainments = ref<Containment[]>([]);

    const columns = [
      {
        name: "containmentType",
        required: true,
        label: "Containmenttype",
        align: "left" as "left",
        field: "containmentType",
        sortable: true,
      },{
        name: "trayWidth",
        required: true,
        label: "Traywidth",
        align: "left" as "left",
        field: "trayWidth",
        sortable: true,
      },{
        name: "trayLength",
        required: true,
        label: "Traylength",
        align: "left" as "left",
        field: "trayLength",
        sortable: true,
      },{
        name: "trayHeight",
        required: true,
        label: "Trayheight",
        align: "left" as "left",
        field: "trayHeight",
        sortable: true,
      },{
        name: "numberOfPathwayLanes",
        required: true,
        label: "Numberofpathwaylanes",
        align: "left" as "left",
        field: "numberOfPathwayLanes",
        sortable: true,
      },{
        name: "distanceBetweenRackTypeAndFirstLane",
        required: true,
        label: "Distancebetweenracktypeandfirstlane",
        align: "left" as "left",
        field: "distanceBetweenRackTypeAndFirstLane",
        sortable: true,
      },{
        name: "distanceBetweenEachLaneLevel",
        required: true,
        label: "Distancebetweeneachlanelevel",
        align: "left" as "left",
        field: "distanceBetweenEachLaneLevel",
        sortable: true,
      },{
        name: "startXCoordinate",
        required: true,
        label: "Startxcoordinate",
        align: "left" as "left",
        field: "startXCoordinate",
        sortable: true,
      },{
        name: "endXCoordinate",
        required: true,
        label: "Endxcoordinate",
        align: "left" as "left",
        field: "endXCoordinate",
        sortable: true,
      },{
        name: "startYCoordinate",
        required: true,
        label: "Startycoordinate",
        align: "left" as "left",
        field: "startYCoordinate",
        sortable: true,
      },{
        name: "endYCoordinate",
        required: true,
        label: "Endycoordinate",
        align: "left" as "left",
        field: "endYCoordinate",
        sortable: true,
      },{
        name: "costPerLength",
        required: true,
        label: "Costperlength",
        align: "left" as "left",
        field: "costPerLength",
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
      containmentId: null as number | null,
    });

    const form = ref<Partial<Containment>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedContainments.value.length > 0
        ? `Are you sure you want to delete ${selectedContainments.value.length} containment(s)?`
        : "Are you sure you want to delete this containment?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchContainments = async () => {
      loading.value = true;
      try {
        containments.value = await containmentService.
        getContainmentsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch containments:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Containment",
        mode: "create",
      };
    };

    const openEditDialog = (containment: Containment) => {
      form.value = { ...containment };
      dialog.value = {
        show: true,
        title: "Edit Containment",
        mode: "edit",
      };
      deleteDialog.value.containmentId = containment.id;
    };

    const confirmDelete = (containmentId: number) => {
      deleteDialog.value = {
        show: true,
        containmentId: containmentId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      containmentType: form.value.containmentType,
      trayWidth: Number(form.value.trayWidth),
      trayLength: Number(form.value.trayLength),
      trayHeight: Number(form.value.trayHeight),
      numberOfPathwayLanes: Number(form.value.numberOfPathwayLanes),
      distanceBetweenRackTypeAndFirstLane: Number(form.value.distanceBetweenRackTypeAndFirstLane),
      distanceBetweenEachLaneLevel: Number(form.value.distanceBetweenEachLaneLevel),
      startXCoordinate: Number(form.value.startXCoordinate),
      endXCoordinate: Number(form.value.endXCoordinate),
      startYCoordinate: Number(form.value.startYCoordinate),
      endYCoordinate: Number(form.value.endYCoordinate),
      costPerLength: parseFloat(form.value.costPerLength),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await containmentService.createContainment(submitData);
    } else {
      if (deleteDialog.value.containmentId) {
        await containmentService.updateContainment(
          deleteDialog.value.containmentId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchContainments(); // Fetch updated containment data
    emit("containment-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} containment:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedContainments.value.length > 0) {
          for (const containment of selectedContainments.value) {
            await containmentService.deleteContainment(containment.id);
          }
          selectedContainments.value = [];
        } else if (deleteDialog.value.containmentId) {
          await containmentService.deleteContainment(deleteDialog.value.containmentId);
        }
        await fetchContainments();
        emit("containment-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete containment(s):", error);
      }
    };

    onMounted(() => {
      fetchContainments();
    });

    return {
      loading,
      containments,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedContainments,
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