<template>
  <div
    class="fiberTransceiverType-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Fiber Transceiver Types
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="Fiber Transceiver Type"
      v-model:search-term="filter"
      :has-selected="selectedFiberTransceiverTypes.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="fiberTransceiverTypes"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedFiberTransceiverTypes"
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
          type="text"
          required
          :rules="[(val) => !!val || 'name is required']"
          placeholder="Enter name"
        />

        <q-input
          v-model.trim="form.transceiverType"
          label="Transceivertype"
          dark
          outlined
          type="text"
          required
          :rules="[(val) => !!val || 'transceiverType is required']"
          placeholder="Enter transceivertype"
        />

        <q-input
          v-model.number.trim="form.transceiverPowerDraw"
          label="Transceiverpowerdraw"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'transceiverPowerDraw is required']"
          placeholder="Enter transceiverpowerdraw"
        />

        <q-input
          v-model.number.trim="form.transceiverCost"
          label="Transceivercost"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'transceiverCost is required']"
          placeholder="Enter transceivercost"
        />

        <q-input
          v-model.trim="form.location"
          label="Location"
          dark
          outlined
          type="text"
          required
          :rules="[(val) => !!val || 'location is required']"
          placeholder="Enter location"
        />

        <q-toggle
          v-model="form.isInGpu"
          label="Isingpu"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.isInCPU"
          label="Isincpu"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.isInLeafSwitch"
          label="Isinleafswitch"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.isInSpineSwitch"
          label="Isinspineswitch"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.isInSuperSpineSwitch"
          label="Isinsuperspineswitch"
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
import { FiberTransceiverType } from "src/types/models";
import { fiberTransceiverTypeService } from "../../services/fiberTransceiverTypeService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "FiberTransceiverTypeManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["fiberTransceiverType-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const fiberTransceiverTypes = ref<FiberTransceiverType[]>([]);
    const filter = ref("");
    const selectedFiberTransceiverTypes = ref<FiberTransceiverType[]>([]);

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
        name: "transceiverType",
        required: true,
        label: "Transceiver Type",
        align: "left" as "left",
        field: "transceiverType",
        sortable: true,
      },
      {
        name: "transceiverPowerDraw",
        required: true,
        label: "Transceiver Power Draw",
        align: "left" as "left",
        field: "transceiverPowerDraw",
        sortable: true,
      },
      {
        name: "transceiverCost",
        required: true,
        label: "Transceiver Cost",
        align: "left" as "left",
        field: "transceiverCost",
        sortable: true,
      },
      {
        name: "location",
        required: true,
        label: "Location",
        align: "left" as "left",
        field: "location",
        sortable: true,
      },
      {
        name: "isInGpu",
        required: true,
        label: "Is In GPU?",
        align: "left" as "left",
        field: "isInGpu",
        sortable: true,
      },
      {
        name: "isInCPU",
        required: true,
        label: "Is In CPU?",
        align: "left" as "left",
        field: "isInCPU",
        sortable: true,
      },
      {
        name: "isInLeafSwitch",
        required: true,
        label: "Is In LeafSwitch?",
        align: "left" as "left",
        field: "isInLeafSwitch",
        sortable: true,
      },
      {
        name: "isInSpineSwitch",
        required: true,
        label: "Is In SpineSwitch?",
        align: "left" as "left",
        field: "isInSpineSwitch",
        sortable: true,
      },
      {
        name: "isInSuperSpineSwitch",
        required: true,
        label: "Is In SuperSpineSwitch?",
        align: "left" as "left",
        field: "isInSuperSpineSwitch",
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
      fiberTransceiverTypeId: null as number | null,
    });

    const form = ref<Partial<FiberTransceiverType>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedFiberTransceiverTypes.value.length > 0
        ? `Are you sure you want to delete ${selectedFiberTransceiverTypes.value.length} fiberTransceiverType(s)?`
        : "Are you sure you want to delete this fiberTransceiverType?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchFiberTransceiverTypes = async () => {
      loading.value = true;
      try {
        fiberTransceiverTypes.value =
          await fiberTransceiverTypeService.getFiberTransceiverTypesByCustomerAndDataHallId(
            customerId,
            dataHallId
          );
      } catch (error) {
        console.error("Failed to fetch fiberTransceiverTypes:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Fiber Transceiver Type",
        mode: "create",
      };
    };

    const openEditDialog = (fiberTransceiverType: FiberTransceiverType) => {
      form.value = { ...fiberTransceiverType };
      dialog.value = {
        show: true,
        title: "Edit Fiber Transceiver Type",
        mode: "edit",
      };
      deleteDialog.value.fiberTransceiverTypeId = fiberTransceiverType.id;
    };

    const confirmDelete = (fiberTransceiverTypeId: number) => {
      deleteDialog.value = {
        show: true,
        fiberTransceiverTypeId: fiberTransceiverTypeId,
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
          await fiberTransceiverTypeService.createFiberTransceiverType(
            createData
          );
        } else {
          if (deleteDialog.value.fiberTransceiverTypeId) {
            const updateData = {
              ...form.value,
              customerId: Number(form.value.customerId),
              dataHallId: Number(form.value.dataHallId),
            };
            await fiberTransceiverTypeService.updateFiberTransceiverType(
              deleteDialog.value.fiberTransceiverTypeId,
              updateData
            );
          }
        }
        dialog.value.show = false;
        await fetchFiberTransceiverTypes();
        emit("fiberTransceiverType-updated");
      } catch (error) {
        console.error(
          `Failed to ${dialog.value.mode} fiberTransceiverType:`,
          error
        );
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedFiberTransceiverTypes.value.length > 0) {
          for (const fiberTransceiverType of selectedFiberTransceiverTypes.value) {
            await fiberTransceiverTypeService.deleteFiberTransceiverType(
              fiberTransceiverType.id
            );
          }
          selectedFiberTransceiverTypes.value = [];
        } else if (deleteDialog.value.fiberTransceiverTypeId) {
          await fiberTransceiverTypeService.deleteFiberTransceiverType(
            deleteDialog.value.fiberTransceiverTypeId
          );
        }
        await fetchFiberTransceiverTypes();
        emit("fiberTransceiverType-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete fiberTransceiverType(s):", error);
      }
    };

    onMounted(() => {
      fetchFiberTransceiverTypes();
    });

    return {
      loading,
      fiberTransceiverTypes,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedFiberTransceiverTypes,
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
