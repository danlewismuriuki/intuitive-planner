<template>
  <div
    class="leafSwitch-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      LeafSwitchs
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="LeafSwitch"
      v-model:search-term="filter"
      :has-selected="selectedLeafSwitchs.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
     :rows="filteredLeafSwitches"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedLeafSwitchs"
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
          v-model.trim="form.nameOfSwitch"
          label="Nameofswitch"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'nameOfSwitch is required']"
          placeholder="Enter nameofswitch"
        />

        <q-input
          v-model.number.trim="form.sizeInNumberOfRackUnits"
          label="Sizeinnumberofrackunits"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'sizeInNumberOfRackUnits is required']"
          placeholder="Enter sizeinnumberofrackunits"
        />

        <q-input
          v-model.number.trim="form.switchRuLocationStart"
          label="Switchrulocationstart"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'switchRuLocationStart is required']"
          placeholder="Enter switchrulocationstart"
        />

        <q-input
          v-model.number.trim="form.widthInMm"
          label="Widthinmm"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'widthInMm is required']"
          placeholder="Enter widthinmm"
        />

        <q-input
          v-model.number.trim="form.depthInMm"
          label="Depthinmm"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'depthInMm is required']"
          placeholder="Enter depthinmm"
        />

        <q-input
          v-model.number.trim="form.totalNumberOfFiberGbicPorts"
          label="Totalnumberoffibergbicports"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'totalNumberOfFiberGbicPorts is required']"
          placeholder="Enter totalnumberoffibergbicports"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberPortsPerGbic"
          label="Numberoffiberportspergbic"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberPortsPerGbic is required']"
          placeholder="Enter numberoffiberportspergbic"
        />

        <q-input
          v-model.trim="form.transceiverType"
          label="Transceivertype"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'transceiverType is required']"
          placeholder="Enter transceivertype"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberPortsToGpu"
          label="Numberoffiberportstogpu"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberPortsToGpu is required']"
          placeholder="Enter numberoffiberportstogpu"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberPortsToSpineSwitch"
          label="Numberoffiberportstospineswitch"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberPortsToSpineSwitch is required']"
          placeholder="Enter numberoffiberportstospineswitch"
        />

        <q-input
          v-model.number.trim="form.powerConsumptionWatts"
          label="Powerconsumptionwatts"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'powerConsumptionWatts is required']"
          placeholder="Enter powerconsumptionwatts"
        />

        <q-input
          v-model.number.trim="form.cost"
          label="Cost"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'cost is required']"
          placeholder="Enter cost"
        />

        <q-select
            v-model="form.leafSwitchRackId"
            :options="leafSwitchRackOptions" 
            label="Leaf Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Leaf Switch Rack is required']"
            option-value="value"             
            option-label="label"       
            emit-value
            map-options
            @update:model-value="val => console.log('Leaf Switch Rack selected:', val)" />

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
import { LeafSwitch, LeafSwitchRack } from "src/types/models";
import { leafSwitchService } from "../../services/leafSwitchService";
import { leafSwitchRackService } from "../../services/leafSwitchRackService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "LeafSwitchManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["leafSwitch-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const leafSwitchs = ref<LeafSwitch[]>([]);
    const leafSwitchRacks = ref<LeafSwitchRack[]>([]);
    const filter = ref("");
    const selectedLeafSwitchs = ref<LeafSwitch[]>([]);

    const columns = [
      {
        name: "nameOfSwitch",
        required: true,
        label: "Nameofswitch",
        align: "left" as "left",
        field: "nameOfSwitch",
        sortable: true,
      },{
        name: "sizeInNumberOfRackUnits",
        required: true,
        label: "Sizeinnumberofrackunits",
        align: "left" as "left",
        field: "sizeInNumberOfRackUnits",
        sortable: true,
      },{
        name: "switchRuLocationStart",
        required: true,
        label: "Switchrulocationstart",
        align: "left" as "left",
        field: "switchRuLocationStart",
        sortable: true,
      },{
        name: "widthInMm",
        required: true,
        label: "Widthinmm",
        align: "left" as "left",
        field: "widthInMm",
        sortable: true,
      },{
        name: "depthInMm",
        required: true,
        label: "Depthinmm",
        align: "left" as "left",
        field: "depthInMm",
        sortable: true,
      },{
        name: "totalNumberOfFiberGbicPorts",
        required: true,
        label: "Totalnumberoffibergbicports",
        align: "left" as "left",
        field: "totalNumberOfFiberGbicPorts",
        sortable: true,
      },{
        name: "numberOfFiberPortsPerGbic",
        required: true,
        label: "Numberoffiberportspergbic",
        align: "left" as "left",
        field: "numberOfFiberPortsPerGbic",
        sortable: true,
      },{
        name: "transceiverType",
        required: true,
        label: "Transceivertype",
        align: "left" as "left",
        field: "transceiverType",
        sortable: true,
      },{
        name: "numberOfFiberPortsToGpu",
        required: true,
        label: "Numberoffiberportstogpu",
        align: "left" as "left",
        field: "numberOfFiberPortsToGpu",
        sortable: true,
      },{
        name: "numberOfFiberPortsToSpineSwitch",
        required: true,
        label: "Numberoffiberportstospineswitch",
        align: "left" as "left",
        field: "numberOfFiberPortsToSpineSwitch",
        sortable: true,
      },{
        name: "powerConsumptionWatts",
        required: true,
        label: "Powerconsumptionwatts",
        align: "left" as "left",
        field: "powerConsumptionWatts",
        sortable: true,
      },{
        name: "cost",
        required: true,
        label: "Cost",
        align: "left" as "left",
        field: "cost",
        sortable: true,
      },{
        name: "leafSwitchRack",
        label: "Leaf Switch Rack Name",
        align: "left" as "left",    
        field: (row: LeafSwitch) => {
          const rack = leafSwitchRacks.value.find(r => r.id === row.leafSwitchRackId);
          return rack ? rack.name : 'N/A';
        },
        sortable: true 
      }
    ];

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      leafSwitchId: null as number | null,
    });

    const form = ref<Partial<LeafSwitch>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedLeafSwitchs.value.length > 0
        ? `Are you sure you want to delete ${selectedLeafSwitchs.value.length} leafSwitch(s)?`
        : "Are you sure you want to delete this leafSwitch?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const filteredLeafSwitches = computed(() => {
  if (!filter.value) return leafSwitchs.value; 
  const searchTerm = filter.value.toLowerCase(); 

  return leafSwitchs.value.filter((leafSwitch) => {
    const matchesLeafSwitchFields = Object.values(leafSwitch).some((value) =>
      value && value.toString().toLowerCase().includes(searchTerm)
    );
    const matchesLeafSwitchRack = leafSwitch.leafSwitchRack && 
      leafSwitch.leafSwitchRack.name && 
      leafSwitch.leafSwitchRack.name.toLowerCase().includes(searchTerm);
    return matchesLeafSwitchFields || matchesLeafSwitchRack;
  });
});

    
    const leafSwitchRackOptions = computed(() =>
    leafSwitchRacks.value.map((rack) => ({
        label: rack.name,
        value: rack.id,
      }))
    );

    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    const [fetchedLeafSwitchRacks] = await Promise.all([
      leafSwitchRackService.getAllLeafSwitchRacks(),
    ]);

    console.log('Fetched Leaf Switch Racks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));

    leafSwitchRacks.value = fetchedLeafSwitchRacks;
    console.log('Leaf Switch Rack Options:', JSON.stringify(leafSwitchRackOptions.value, null, 2));
  } catch (error) {
    console.error("Failed to fetch related data:", error);
  }
};

    const fetchLeafSwitchs = async () => {
      loading.value = true;
      try {
        leafSwitchs.value = await leafSwitchService
        .getLeafSwitchsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch leafSwitchs:", error);
      } finally {
        loading.value = false;
      }
    };
    
    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New LeafSwitch",
        mode: "create",
      };
    };

    const openEditDialog = (leafSwitch: LeafSwitch) => {
      form.value = { ...leafSwitch };
      dialog.value = {
        show: true,
        title: "Edit LeafSwitch",
        mode: "edit",
      };
      deleteDialog.value.leafSwitchId = leafSwitch.id;
    };

    const confirmDelete = (leafSwitchId: number) => {
      deleteDialog.value = {
        show: true,
        leafSwitchId: leafSwitchId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };


    const handleSubmit = async () => {
  try {
    console.log("Submitting form data:", form.value);

    const updatedData = {
      nameOfSwitch: form.value.nameOfSwitch,
      sizeInNumberOfRackUnits: Number(form.value.sizeInNumberOfRackUnits),
      switchRuLocationStart: Number(form.value.switchRuLocationStart),
      widthInMm: Number(form.value.widthInMm),
      depthInMm: Number(form.value.depthInMm),
      totalNumberOfFiberGbicPorts: Number(form.value.totalNumberOfFiberGbicPorts),
      numberOfFiberPortsPerGbic: Number(form.value.numberOfFiberPortsPerGbic),
      transceiverType: form.value.transceiverType,
      numberOfFiberPortsToGpu: Number(form.value.numberOfFiberPortsToGpu),
      numberOfFiberPortsToSpineSwitch: Number(form.value.numberOfFiberPortsToSpineSwitch),
      powerConsumptionWatts: Number(form.value.powerConsumptionWatts),
      cost: parseFloat(form.value.cost),
      customerId: Number(form.value.customerId),
      dataHallId: Number(form.value.dataHallId),
      leafSwitchRackId: Number(form.value.leafSwitchRackId),
    };

    if (dialog.value.mode === "create") {
      await leafSwitchService.createLeafSwitch(updatedData);
    } else {
      if (deleteDialog.value.leafSwitchId) {
        await leafSwitchService.
        updateLeafSwitch(deleteDialog.value.leafSwitchId, updatedData);
      }
    }

    dialog.value.show = false;
    await fetchLeafSwitchs(); 
    emit("leafSwitch-updated");
  } catch (error) {
    alert("Failed to save data. Please try again.");
  }
};

    const handleDelete = async () => {
      try {
        if (selectedLeafSwitchs.value.length > 0) {
          for (const leafSwitch of selectedLeafSwitchs.value) {
            await leafSwitchService.deleteLeafSwitch(leafSwitch.id);
          }
          selectedLeafSwitchs.value = [];
        } else if (deleteDialog.value.leafSwitchId) {
          await leafSwitchService.deleteLeafSwitch(deleteDialog.value.leafSwitchId);
        }
        await fetchLeafSwitchs();
        emit("leafSwitch-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete leafSwitch(s):", error);
      }
    };

    onMounted(() => {
      fetchLeafSwitchs();
      fetchRelatedData();
    });

    return {
      loading,
      leafSwitchs,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedLeafSwitchs,
      filteredLeafSwitches,
      leafSwitchRackOptions,
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