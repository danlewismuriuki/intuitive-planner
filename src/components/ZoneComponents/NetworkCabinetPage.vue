<template>
  <div
    class="networkCabinet-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      NetworkCabinets
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="NetworkCabinet"
      v-model:search-term="filter"
      :has-selected="selectedNetworkCabinets.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredNetworkCabinets"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedNetworkCabinets"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <!-- Form Dialog Component -->
    <FormDialog
      v-model="dialog.show"
      :title="dialog.title"
      :is-valid="isFormValid"
      @save="handleSubmit"
      @cancel="dialog.show = false">

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">

          <q-input
            v-model.trim="form.name"
            label="Name"
            dark
            outlined
            type="string"
            required
            :rules="[(val) => !!val || 'Name is required']"
            placeholder="Enter name"
          />

          <q-toggle
            v-model="form.containsFiberPatchPanel"
            label="Contains Fiber Patch Panel"
            dark
            outlined
            required
          />

          <q-toggle
            v-model="form.containsCopperPatchPanel"
            label="Contains Copper Patch Panel"
            dark
            outlined
            required
          />

          <q-input
            v-model.trim="form.numberOfFiberPatchPanels"
            label="Number of Fiber Patch Panels"
            dark
            outlined
            type="number"
            required
            :rules="[(val) => !!val || 'Number of Fiber Patch Panels is required']"
            placeholder="Enter number of fiber patch panels"
          />

          <q-input
            v-model.trim="form.numberOfCopperPatchPanels"
            label="Number of Copper Patch Panels"
            dark
            outlined
            type="number"
            required
            :rules="[(val) => !!val || 'Number of Copper Patch Panels is required']"
            placeholder="Enter number of copper patch panels"
          />

          <q-input
            v-model.trim="form.widthInMm"
            label="Width (mm)"
            dark
            outlined
            type="number"
            required
            :rules="[(val) => !!val || 'Width in mm is required']"
            placeholder="Enter width in mm"
          />

          <q-input
            v-model.trim="form.heightInMm"
            label="Height (mm)"
            dark
            outlined
            type="number"
            required
            :rules="[(val) => !!val || 'Height in mm is required']"
            placeholder="Enter height in mm"
          />

          <q-input
            v-model.trim="form.weightInKg"
            label="Weight (kg)"
            dark
            outlined
            type="number"
            required
            :rules="[(val) => !!val || 'Weight in kg is required']"
            placeholder="Enter weight in kg"
          />

          <q-select
            v-model="form.networkRoomId"
            :options="networkRoomOptions"
            label="Network Room"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Network Room is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Network Room selected:', val)"
          />

          <q-select
            v-model="form.meetMeRoomId"
            :options="meetMeRoomOptions"
            label="Meet Me Room"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Meet Me Room is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Meet Me Room selected:', val)"
          />

          <q-select
            v-model="form.zoneId"
            :options="zoneOptions"
            label="Zone"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Zone is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Zone selected:', val)"
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
            @update:model-value="val => console.log('Leaf Switch Rack selected:', val)"
          />

          <q-select
            v-model="form.spineLeafSwitchRackId"
            :options="spineLeafSwitchRackOptions"
            label="Spine Leaf Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Spine Leaf Switch Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Spine Leaf Switch Rack selected:', val)"
          />

          <q-select
            v-model="form.superSpineSwitchRackId"
            :options="superSpineSwitchRackOptions"
            label="Super Spine Switch Rack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Super Spine Switch Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Super Spine Switch Rack selected:', val)"
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
import { Zone, NetworkCabinet, NetworkRoom, MeetMeRoom, LeafSwitchRack, SpineLeafSwitchRack ,SuperSpineSwitchRack } from "src/types/models";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { networkCabinetService } from "src/services/networkCabinetService";


import { networkRoomService } from "src/services/networkRoomService";
import { zoneService } from "src/services/zoneService";
import { meetMeRoomService } from "src/services/meetMeRoomService";
import { leafSwitchRackService } from "src/services/leafSwitchRackService";
import { spineLeafSwitchRackService } from "src/services/spineLeafSwitchRackService";
import { superSpineSwitchRackService } from "src/services/superSpineSwitchRackService";



export default defineComponent({
  name: "NetworkCabinetManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["networkCabinet-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const networkCabinets = ref<NetworkCabinet[]>([]);

    const networkRoom = ref<NetworkRoom[]>([]);
    const zone = ref<Zone[]>([]);
    const meetMeRoom = ref<MeetMeRoom[]>([]);
    const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    const spineLeafSwitchRack = ref<SpineLeafSwitchRack[]>([]);
    const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([]);


    const filter = ref("");
    const selectedNetworkCabinets = ref<NetworkCabinet[]>([]);

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
    name: "containsFiberPatchPanel",
    required: true,
    label: "Contains Fiber Patch Panel",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.containsFiberPatchPanel,
    sortable: true,
  },
  {
    name: "containsCopperPatchPanel",
    required: true,
    label: "Contains Copper Patch Panel",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.containsCopperPatchPanel,
    sortable: true,
  },
  {
    name: "numberOfFiberPatchPanels",
    required: true,
    label: "Number of Fiber Patch Panels",
    align: "left" as "left",
    field: "numberOfFiberPatchPanels",
    sortable: true,
  },
  {
    name: "numberOfCopperPatchPanels",
    required: true,
    label: "Number of Copper Patch Panels",
    align: "left" as "left",
    field: "numberOfCopperPatchPanels",
    sortable: true,
  },
  {
    name: "widthInMm",
    required: true,
    label: "Width (mm)",
    align: "left" as "left",
    field: "widthInMm",
    sortable: true,
  },
  {
    name: "heightInMm",
    required: true,
    label: "Height (mm)",
    align: "left" as "left",
    field: "heightInMm",
    sortable: true,
  },
  {
    name: "weightInKg",
    required: true,
    label: "Weight (kg)",
    align: "left" as "left",
    field: "weightInKg",
    sortable: true,
  },
  {
    name: "networkRoomId",
    required: true,
    label: "Network Room",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.networkRoom?.name || networkRoom.value.find((mMR) => mMR.id === row.networkRoomId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "meetMeRoomId",
    required: true,
    label: "Meet Me Room",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.meetMeRoom?.name ||
      meetMeRoom.value.find((mMR) => mMR.id === row.meetMeRoomId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "zoneId",
    required: true,
    label: "Zone",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.zone?.name || zone.value.find((z) => z.id === row.zoneId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "leafSwitchRackId",
    required: true,
    label: "Leaf Switch Rack",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.leafSwitchRack?.name || leafSwitchRack.value.find((lSR) => lSR.id === row.leafSwitchRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "spineLeafSwitchRackId",
    required: true,
    label: "Spine Leaf Switch Rack",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.spineLeafSwitchRack?.name || spineLeafSwitchRack.value.find((sLS) => sLS.id === row.spineLeafSwitchRackId)?.name || "N/A",
    sortable: true,
  },
  {
    name: "superSpineSwitchRackId",
    required: true,
    label: "Super Spine Switch Rack",
    align: "left" as "left",
    field: (row: NetworkCabinet) =>
      row.superSpineSwitchRack?.name || superSpineSwitchRack.value.find((sSsR) => sSsR.id === row.superSpineSwitchRackId)?.name || "N/A",
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
      networkCabinetId: null as number | null,
    });

const form = ref<Partial<NetworkCabinet>>({})


    const deleteConfirmMessage = computed(() => {
      return selectedNetworkCabinets.value.length > 0
        ? `Are you sure you want to delete ${selectedNetworkCabinets.value.length} networkCabinet(s)?`
        : "Are you sure you want to delete this networkCabinet?";
    });

      const isFormValid = computed(() => {
    return !!(
      form.value.name?.trim() &&
      typeof form.value.containsFiberPatchPanel === 'boolean' &&
      typeof form.value.containsCopperPatchPanel === 'boolean' &&
      (form.value.numberOfFiberPatchPanels ?? 0) > 0 && 
      (form.value.numberOfCopperPatchPanels ?? 0) > 0 &&
      (form.value.widthInMm ?? 0) > 0 &&
      (form.value.heightInMm ?? 0) > 0 &&
      (form.value.weightInKg ?? 0) > 0 &&
      form.value.customerId &&
      form.value.dataHallId &&
      form.value.networkRoomId &&
      form.value.meetMeRoomId &&
      form.value.zoneId &&
      form.value.leafSwitchRackId &&
      form.value.spineLeafSwitchRackId &&
      form.value.superSpineSwitchRackId
    );
  });


    const networkRoomOptions = computed(() =>
      networkRoom.value.map((networkRoomMap) => ({
        label: networkRoomMap.name,
        value: networkRoomMap.id,
      }))
    );

    const meetMeRoomOptions = computed(() =>
      meetMeRoom.value.map((meetMeRoomMap) => ({
        label: meetMeRoomMap.name,
        value: meetMeRoomMap.id,
      }))
    );

    const zoneOptions = computed(() =>
      zone.value.map((zoneMap) => ({
        label: zoneMap.name,
        value: zoneMap.id,
      }))
    );


    const leafSwitchRackOptions = computed(() =>
      leafSwitchRack.value.map((leafSwitchRackMap) => ({
        label: leafSwitchRackMap.name,
        value: leafSwitchRackMap.id,
      }))
    );

    const spineLeafSwitchRackOptions = computed(() =>
      spineLeafSwitchRack.value.map((spineLeafSwitchRackMap) => ({
        label: spineLeafSwitchRackMap.name,
        value: spineLeafSwitchRackMap.id,
      }))
    );
    
    const superSpineSwitchRackOptions = computed(() =>
      superSpineSwitchRack.value.map((superSpineSwitchRackMap) => ({
        label: superSpineSwitchRackMap.name,
        value: superSpineSwitchRackMap.id,
      }))
    );

        const resetFormData = () => {
      form.value = {
        name: '',
        containsFiberPatchPanel: false,
        containsCopperPatchPanel: false,
        numberOfFiberPatchPanels: 0,
        numberOfCopperPatchPanels: 0,
        widthInMm: 0,
        heightInMm: 0,
        weightInKg: 0,
        customerId: customerId,
        dataHallId: dataHallId,
        networkRoomId: undefined, 
        meetMeRoomId: undefined,
        zoneId: undefined,
        leafSwitchRackId: undefined,
        spineLeafSwitchRackId: undefined,
        superSpineSwitchRackId: undefined,
      };
    };


      const filteredNetworkCabinets = computed(() => {
        return networkCabinets.value.filter((networkCabinet) => {
          const searchTerm = filter.value.trim().toLowerCase();

          // Combine all relevant fields into a single string
          const combinedFields = [
            networkCabinet.id.toString().toLowerCase(),
            networkCabinet.name.toLowerCase(),
            networkCabinet.containsFiberPatchPanel.toString(), // Using the boolean directly
            networkCabinet.containsCopperPatchPanel.toString(), // Using the boolean directly
            networkCabinet.numberOfFiberPatchPanels.toString(),
            networkCabinet.numberOfCopperPatchPanels.toString(),
            networkCabinet.widthInMm.toString(),
            networkCabinet.heightInMm.toString(),
            networkCabinet.weightInKg.toString(),
            networkCabinet.customer.name.toLowerCase(),
            networkCabinet.dataHall.name.toLowerCase(),
            networkCabinet.networkRoom?.name.toLowerCase() || "",
            networkCabinet.meetMeRoom?.name.toLowerCase() || "",
            networkCabinet.zone?.name.toLowerCase() || "",
            networkCabinet.leafSwitchRack?.name.toLowerCase() || "",
            networkCabinet.spineLeafSwitchRack?.name.toLowerCase() || "",
            networkCabinet.superSpineSwitchRack?.name.toLowerCase() || "",
          ].join(" ");

          // Return true if any of the combined fields include the search term
          return combinedFields.includes(searchTerm);
        });
      });

    const fetchNetworkCabinets = async () => {
      loading.value = true;
      try {
        networkCabinets.value = await networkCabinetService.
        getNetworkCabinetsByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch networkCabinets:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    // Fetching related data for the different entities
    const [
      fetchedNetworkRooms,
      fetchedMeetMeRooms,
      fetchedZones,
      fetchedLeafSwitchRacks,
      fetchedSpineLeafSwitchRacks,
      fetchedSuperSpineSwitchRacks,
    ] = await Promise.all([
      networkRoomService.getRoomsByCustomerId(customerId),  
      meetMeRoomService.getRoomsByCustomerId(customerId),
      zoneService.getZonesByCustomerAndDataHallId(customerId, dataHallId),
      leafSwitchRackService.getLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      spineLeafSwitchRackService.getSpineLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      superSpineSwitchRackService.getSuperSpineSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched NetworkRooms:', JSON.stringify(fetchedNetworkRooms, null, 2));
    console.log('Fetched MeetMeRooms:', JSON.stringify(fetchedMeetMeRooms, null, 2));
    console.log('Fetched Zones:', JSON.stringify(fetchedZones, null, 2));
    console.log('Fetched LeafSwitchRacks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));
    console.log('Fetched SpineLeafSwitchRacks:', JSON.stringify(fetchedSpineLeafSwitchRacks, null, 2));
    console.log('Fetched SuperSpineSwitchRacks:', JSON.stringify(fetchedSuperSpineSwitchRacks, null, 2));

    // Storing fetched data in respective reactive variables
    networkRoom.value = fetchedNetworkRooms;
    meetMeRoom.value = fetchedMeetMeRooms;
    zone.value = fetchedZones;
    leafSwitchRack.value = fetchedLeafSwitchRacks;
    spineLeafSwitchRack.value = fetchedSpineLeafSwitchRacks;
    superSpineSwitchRack.value = fetchedSuperSpineSwitchRacks;

    // Logging the options for debugging
    console.log('NetworkRoom Options:', JSON.stringify(networkRoomOptions.value, null, 2));
    console.log('MeetMeRoom Options:', JSON.stringify(meetMeRoomOptions.value, null, 2));
    console.log('Zone Options:', JSON.stringify(zoneOptions.value, null, 2));
    console.log('LeafSwitchRack Options:', JSON.stringify(leafSwitchRackOptions.value, null, 2));
    console.log('SpineLeafSwitchRack Options:', JSON.stringify(spineLeafSwitchRackOptions.value, null, 2));
    console.log('SuperSpineSwitchRack Options:', JSON.stringify(superSpineSwitchRackOptions.value, null, 2));

  } catch (error) {
    console.error('Failed to fetch related data:', error);
  }
};


    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New NetworkCabinet",
        mode: "create",
      };
    };

    const openEditDialog = (networkCabinet: NetworkCabinet) => {
      form.value = { ...networkCabinet };
      dialog.value = {
        show: true,
        title: "Edit NetworkCabinet",
        mode: "edit",
      };
      deleteDialog.value.networkCabinetId = networkCabinet.id;
    };

    const confirmDelete = (networkCabinetId: number) => {
      deleteDialog.value = {
        show: true,
        networkCabinetId: networkCabinetId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
  try {
    // Validate required fields
    if (!form.value.name?.trim() ||
    !form.value.networkRoomId ||
    !form.value.meetMeRoomId ||
    !form.value.zoneId ||
    !form.value.leafSwitchRackId ||
    !form.value.spineLeafSwitchRackId ||
    !form.value.superSpineSwitchRackId) {
      console.error('All fields are required');
      return;
    }

    // Build the data to be submitted
    const submitData = {
      name: form.value.name.trim(),
      customerId: Number(customerId),
      dataHallId: Number(dataHallId),
      networkRoomId: Number(form.value.networkRoomId),
      meetMeRoomId: Number(form.value.meetMeRoomId),
      zoneId: Number(form.value.zoneId),
      leafSwitchRackId: Number(form.value.leafSwitchRackId),
      spineLeafSwitchRackId: Number(form.value.spineLeafSwitchRackId),
      superSpineSwitchRackId: Number(form.value.superSpineSwitchRackId),
      containsFiberPatchPanel: form.value.containsFiberPatchPanel ?? false,
      containsCopperPatchPanel: form.value.containsCopperPatchPanel ?? false,
      numberOfFiberPatchPanels: Number(form.value.numberOfFiberPatchPanels) || 0,
      numberOfCopperPatchPanels: Number(form.value.numberOfCopperPatchPanels) || 0,
      widthInMm: Number(form.value.widthInMm) || 0,
      heightInMm: Number(form.value.heightInMm) || 0,
      weightInKg: Number(form.value.weightInKg) || 0,
    };

    // Check the mode to either create or update the record
    if (dialog.value.mode === "create") {
      await networkCabinetService.createNetworkCabinet(submitData);
    } else {
      if (deleteDialog.value.networkCabinetId) {
        await networkCabinetService.updateNetworkCabinet(deleteDialog.value.networkCabinetId, submitData);
      }
    }

    // Close the dialog and fetch updated data
    dialog.value.show = false;
    await fetchNetworkCabinets();
    emit("networkCabinet-updated");

  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} networkCabinet:`, error);
  }
};


    const handleDelete = async () => {
      try {
        if (selectedNetworkCabinets.value.length > 0) {
          for (const networkCabinet of selectedNetworkCabinets.value) {
            await networkCabinetService.deleteNetworkCabinet(networkCabinet.id);
          }
          selectedNetworkCabinets.value = [];
        } else if (deleteDialog.value.networkCabinetId) {
          await networkCabinetService.deleteNetworkCabinet(deleteDialog.value.networkCabinetId);
        }
        await fetchNetworkCabinets();
        emit("networkCabinet-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete networkCabinet(s):", error);
      }
    };

    onMounted(() => {
      fetchNetworkCabinets();
      fetchRelatedData();
    });



    
    // const networkRoom = ref<NetworkRoom[]>([]);
    // const zone = ref<Zone[]>([]);
    // const meetMeRoom = ref<MeetMeRoom[]>([]);
    // const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    // const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([]);

    return {
      loading,
      filteredNetworkCabinets,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,

      networkRoomOptions,
      zoneOptions,
      meetMeRoomOptions,
      leafSwitchRackOptions,
      spineLeafSwitchRackOptions,
      superSpineSwitchRackOptions,

      selectedNetworkCabinets,
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