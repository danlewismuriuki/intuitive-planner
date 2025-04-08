<template>
  <div class="superSpineLeafSwitch-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      SuperSpineLeafSwitchs
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="SuperSpineLeafSwitch" v-model:search-term="filter"
      :has-selected="selectedSuperSpineLeafSwitchs.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="superSpineLeafSwitchs" :columns="columns" :loading="loading"
      v-model:selected="selectedSuperSpineLeafSwitchs" @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

        <q-input v-model.trim="form.nameOfSwitch" label="Nameofswitch" dark outlined type="string" required
          :rules="[(val) => !!val || 'nameOfSwitch is required']" placeholder="Enter nameofswitch" />

        <q-input v-model.number.trim="form.sizeInNumberOfRackUnits" label="Sizeinnumberofrackunits" dark outlined
          type="number" required :rules="[(val) => !!val || 'sizeInNumberOfRackUnits is required']"
          placeholder="Enter sizeinnumberofrackunits" />

        <q-input v-model.number.trim="form.switchRuLocationStart" label="Switchrulocationstart" dark outlined
          type="number" required :rules="[(val) => !!val || 'switchRuLocationStart is required']"
          placeholder="Enter switchrulocationstart" />

        <q-input v-model.number.trim="form.widthInMm" label="Widthinmm" dark outlined type="number" required
          :rules="[(val) => !!val || 'widthInMm is required']" placeholder="Enter widthinmm" />

        <q-input v-model.number.trim="form.depthInMm" label="Depthinmm" dark outlined type="number" required
          :rules="[(val) => !!val || 'depthInMm is required']" placeholder="Enter depthinmm" />

        <q-input v-model.number.trim="form.totalNumberOfFiberGbicPorts" label="Totalnumberoffibergbicports" dark
          outlined type="number" required :rules="[(val) => !!val || 'totalNumberOfFiberGbicPorts is required']"
          placeholder="Enter totalnumberoffibergbicports" />

        <q-input v-model.number.trim="form.numberOfFiberPortsPerGbic" label="Numberoffiberportspergbic" dark outlined
          type="number" required :rules="[(val) => !!val || 'numberOfFiberPortsPerGbic is required']"
          placeholder="Enter numberoffiberportspergbic" />

        <q-input v-model.trim="form.transceiverType" label="Transceivertype" dark outlined type="string" required
          :rules="[(val) => !!val || 'transceiverType is required']" placeholder="Enter transceivertype" />

        <q-input v-model.number.trim="form.numberOfFiberPortsToSpineSwitch" label="Numberoffiberportstospineswitch" dark
          outlined type="number" required :rules="[(val) => !!val || 'numberOfFiberPortsToSpineSwitch is required']"
          placeholder="Enter numberoffiberportstospineswitch" />

        <q-input v-model.number.trim="form.numberOfFiberPortsToNetworkRoom" label="Numberoffiberportstonetworkroom" dark
          outlined type="number" required :rules="[(val) => !!val || 'numberOfFiberPortsToNetworkRoom is required']"
          placeholder="Enter numberoffiberportstonetworkroom" />

        <q-input v-model.number.trim="form.powerConsumptionWatts" label="Powerconsumptionwatts" dark outlined
          type="number" required :rules="[(val) => !!val || 'powerConsumptionWatts is required']"
          placeholder="Enter powerconsumptionwatts" />

        <q-input v-model.number.trim="form.cost" label="Cost" dark outlined type="number" required
          :rules="[(val) => !!val || 'cost is required']" placeholder="Enter cost" />
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
import { SuperSpineLeafSwitch } from "src/types/models";
import { superSpineLeafSwitchService } from "../../services/superSpineLeafSwitchService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SuperSpineLeafSwitchManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["superSpineLeafSwitch-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const superSpineLeafSwitchs = ref<SuperSpineLeafSwitch[]>([]);
    const filter = ref("");
    const selectedSuperSpineLeafSwitchs = ref<SuperSpineLeafSwitch[]>([]);

    const columns = [
      {
        name: "nameOfSwitch",
        required: true,
        label: "Nameofswitch",
        align: "left" as "left",
        field: "nameOfSwitch",
        sortable: true,
      }, {
        name: "sizeInNumberOfRackUnits",
        required: true,
        label: "Sizeinnumberofrackunits",
        align: "left" as "left",
        field: "sizeInNumberOfRackUnits",
        sortable: true,
      }, {
        name: "switchRuLocationStart",
        required: true,
        label: "Switchrulocationstart",
        align: "left" as "left",
        field: "switchRuLocationStart",
        sortable: true,
      }, {
        name: "widthInMm",
        required: true,
        label: "Widthinmm",
        align: "left" as "left",
        field: "widthInMm",
        sortable: true,
      }, {
        name: "depthInMm",
        required: true,
        label: "Depthinmm",
        align: "left" as "left",
        field: "depthInMm",
        sortable: true,
      }, {
        name: "totalNumberOfFiberGbicPorts",
        required: true,
        label: "Totalnumberoffibergbicports",
        align: "left" as "left",
        field: "totalNumberOfFiberGbicPorts",
        sortable: true,
      }, {
        name: "numberOfFiberPortsPerGbic",
        required: true,
        label: "Numberoffiberportspergbic",
        align: "left" as "left",
        field: "numberOfFiberPortsPerGbic",
        sortable: true,
      }, {
        name: "transceiverType",
        required: true,
        label: "Transceivertype",
        align: "left" as "left",
        field: "transceiverType",
        sortable: true,
      }, {
        name: "numberOfFiberPortsToSpineSwitch",
        required: true,
        label: "Numberoffiberportstospineswitch",
        align: "left" as "left",
        field: "numberOfFiberPortsToSpineSwitch",
        sortable: true,
      }, {
        name: "numberOfFiberPortsToNetworkRoom",
        required: true,
        label: "Numberoffiberportstonetworkroom",
        align: "left" as "left",
        field: "numberOfFiberPortsToNetworkRoom",
        sortable: true,
      }, {
        name: "powerConsumptionWatts",
        required: true,
        label: "Powerconsumptionwatts",
        align: "left" as "left",
        field: "powerConsumptionWatts",
        sortable: true,
      }, {
        name: "cost",
        required: true,
        label: "Cost",
        align: "left" as "left",
        field: "cost",
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
      superSpineLeafSwitchId: null as number | null,
    });

    const form = ref<Partial<SuperSpineLeafSwitch>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSuperSpineLeafSwitchs.value.length > 0
        ? `Are you sure you want to delete ${selectedSuperSpineLeafSwitchs.value.length} superSpineLeafSwitch(s)?`
        : "Are you sure you want to delete this superSpineLeafSwitch?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchSuperSpineLeafSwitchs = async () => {
      loading.value = true;
      try {
        superSpineLeafSwitchs.value = await superSpineLeafSwitchService
          .getSuperSpineLeafSwitchsByCustomerAndDataHallId(
            customerId,
            dataHallId
          );
      } catch (error) {
        console.error("Failed to fetch superSpineLeafSwitchs:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New SuperSpineLeafSwitch",
        mode: "create",
      };
    };

    const openEditDialog = (superSpineLeafSwitch: SuperSpineLeafSwitch) => {
      form.value = { ...superSpineLeafSwitch };
      dialog.value = {
        show: true,
        title: "Edit SuperSpineLeafSwitch",
        mode: "edit",
      };
      deleteDialog.value.superSpineLeafSwitchId = superSpineLeafSwitch.id;
    };

    const confirmDelete = (superSpineLeafSwitchId: number) => {
      deleteDialog.value = {
        show: true,
        superSpineLeafSwitchId: superSpineLeafSwitchId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    const submitData = {
      nameOfSwitch: form.value.nameOfSwitch,
      sizeInNumberOfRackUnits: Number(form.value.sizeInNumberOfRackUnits),
      switchRuLocationStart: Number(form.value.switchRuLocationStart),
      widthInMm: Number(form.value.widthInMm),
      depthInMm: Number(form.value.depthInMm),
      totalNumberOfFiberGbicPorts: Number(form.value.totalNumberOfFiberGbicPorts),
      numberOfFiberPortsPerGbic: Number(form.value.numberOfFiberPortsPerGbic),
      transceiverType: form.value.transceiverType,
      numberOfFiberPortsToSpineSwitch: Number(form.value.numberOfFiberPortsToSpineSwitch),
      numberOfFiberPortsToNetworkRoom: Number(form.value.numberOfFiberPortsToNetworkRoom),
      powerConsumptionWatts: Number(form.value.powerConsumptionWatts),
      cost: parseFloat(form.value.cost),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId)
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await superSpineLeafSwitchService.createSuperSpineLeafSwitch(submitData);
    } else {
      if (deleteDialog.value.superSpineLeafSwitchId) {
        await superSpineLeafSwitchService.updateSuperSpineLeafSwitch(
          deleteDialog.value.superSpineLeafSwitchId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchSuperSpineLeafSwitchs(); // Fetch updated data
    emit("superSpineLeafSwitch-updated"); // Emit update event
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} super spine leaf switch:`, error);
  }
};



    const handleDelete = async () => {
      try {
        if (selectedSuperSpineLeafSwitchs.value.length > 0) {
          for (const superSpineLeafSwitch of selectedSuperSpineLeafSwitchs.value) {
            await superSpineLeafSwitchService.deleteSuperSpineLeafSwitch(superSpineLeafSwitch.id);
          }
          selectedSuperSpineLeafSwitchs.value = [];
        } else if (deleteDialog.value.superSpineLeafSwitchId) {
          await superSpineLeafSwitchService.deleteSuperSpineLeafSwitch(deleteDialog.value.superSpineLeafSwitchId);
        }
        await fetchSuperSpineLeafSwitchs();
        emit("superSpineLeafSwitch-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete superSpineLeafSwitch(s):", error);
      }
    };

    onMounted(() => {
      fetchSuperSpineLeafSwitchs();
    });

    return {
      loading,
      superSpineLeafSwitchs,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedSuperSpineLeafSwitchs,
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