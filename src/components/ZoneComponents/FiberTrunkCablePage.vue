<template>
  <div
    class="fiberTrunkCable-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      FiberTrunkCables
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="FiberTrunkCable"
      v-model:search-term="filter"
      :has-selected="selectedFiberTrunkCables.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredFiberTrunkCables"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedFiberTrunkCables"
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

        <q-input
          v-model.trim="form.fiberCableType"
          label="Fibercabletype"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'fiberCableType is required']"
          placeholder="Enter fibercabletype"
        />

        <q-input
          v-model.trim="form.fiberTrunkCableCoreCount"
          label="Fibertrunkcablecorecount"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'fiberTrunkCableCoreCount is required']"
          placeholder="Enter fibertrunkcablecorecount"
        />

        <q-input
          v-model.trim="form.fiberTrunkCableSerialID"
          label="Fibertrunkcableserialid"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'fiberTrunkCableSerialID is required']"
          placeholder="Enter fibertrunkcableserialid"
        />

        <q-input
          v-model.trim="form.fireRating"
          label="Firerating"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'fireRating is required']"
          placeholder="Enter firerating"
        />

        <q-input
          v-model.number.trim="form.numberOfFiberCoresPerConnector"
          label="Numberoffibercoresperconnector"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfFiberCoresPerConnector is required']"
          placeholder="Enter numberoffibercoresperconnector"
        />

        <q-input
          v-model.number.trim="form.fibersPerSubUnit"
          label="Fiberspersubunit"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'fibersPerSubUnit is required']"
          placeholder="Enter fiberspersubunit"
        />

        <q-input
          v-model.number.trim="form.numberOfSubUnitsPerCable"
          label="Numberofsubunitspercable"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfSubUnitsPerCable is required']"
          placeholder="Enter numberofsubunitspercable"
        />

        <q-input
          v-model.number.trim="form.fiberTrunkCableDiameter"
          label="Fibertrunkcablediameter"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'fiberTrunkCableDiameter is required']"
          placeholder="Enter fibertrunkcablediameter"
        />

        <q-input
          v-model.number.trim="form.numberOfLegsInTrunk"
          label="Numberoflegsintrunk"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'numberOfLegsInTrunk is required']"
          placeholder="Enter numberoflegsintrunk"
        />

        <q-input
          v-model.number.trim="form.lengthOfLegBreakout"
          label="Lengthoflegbreakout"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'lengthOfLegBreakout is required']"
          placeholder="Enter lengthoflegbreakout"
        />

        <q-toggle
          v-model="form.apcConnector"
          label="Apcconnector"
          dark
          outlined
          required
        />

        <q-input
          v-model.trim="form.legLabelnumber"
          label="Leglabelnumber"
          dark
          outlined
          type="string"
          required
          :rules="[(val) => !!val || 'legLabelnumber is required']"
          placeholder="Enter leglabelnumber"
        />

        <q-input
          v-model.number.trim="form.cableLength"
          label="Cablelength"
          dark
          outlined
          type="number"
          required
          :rules="[(val) => !!val || 'cableLength is required']"
          placeholder="Enter cablelength"
        />
        
        <q-toggle
          v-model="form.redundantFiberFeeds"
          label="Redundantfiberfeeds"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.deliveredToProject"
          label="Deliveredtoproject"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.cablePulled"
          label="CablePulled"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.cablePlugged"
          label="CablePlugged"
          dark
          outlined
          required
        />

        <q-toggle
          v-model="form.cableTested"
          label="Cabletested"
          dark
          outlined
          required
        />

        <q-select
            v-model="form.networkCabinetId"
            :options="networkCabinetOptions"
            label="NetworkCabinet"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Network Cabinet is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Network Cabinet selected:', val)"
          />


          <q-select
            v-model="form.patchPanelModulePortId"
            :options="patchPanelModulePortOptions"
            label="PatchPanelModulePort"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'patchPanelModulePort is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('patchPanelModulePort selected:', val)"
          />


        <q-select
            v-model="form.gpuComputeRackId"
            :options="gpuComputeRackOptions"
            label="GpuComputeRack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'Gpu Compute Rack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Gpu Compute Rack selected:', val)"
          />

        <q-select
            v-model="form.cpuComputeRackId"
            :options="cpuComputeRackOptions"
            label="CpuComputeRack"
            dark
            outlined
            required
            :rules="[(val) => !!val || 'CpuComputeRack is required']"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            @update:model-value="val => console.log('Cpu ComputeRack selected:', val)"
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
import { FiberTrunkCable, GpuComputeRack, CpuComputeRack, Zone, NetworkCabinet, PatchPanelModulePort, LeafSwitchRack, SuperSpineSwitchRack, SpineLeafSwitchRack } from "src/types/models";
import { fiberTrunkCableService } from "../../services/fiberTrunkCableService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

import { networkCabinetService } from "src/services/networkCabinetService";
import { patchPanelModulePortService } from "src/services/patchPanelModulePortService";
import { gpuComputeRackService } from "src/services/gpuComputeRackService";
import { cpuComputeRackService } from "src/services/cpuComputeRackService";
import { zoneService } from "src/services/zoneService";
import { leafSwitchRackService } from "src/services/leafSwitchRackService";
import { superSpineSwitchRackService } from "src/services/superSpineSwitchRackService";
import { spineLeafSwitchRackService } from "src/services/spineLeafSwitchRackService";

export default defineComponent({
  name: "FiberTrunkCableManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["fiberTrunkCable-updated"],
  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const fiberTrunkCables = ref<FiberTrunkCable[]>([]);
    const filter = ref("");
    const selectedFiberTrunkCables = ref<FiberTrunkCable[]>([]);



    const gpuComputeRack = ref<GpuComputeRack[]>([]);
    const cpuComputeRack = ref<CpuComputeRack[]>([]);
    const zone  = ref<Zone[]>([]);
    const leafSwitchRack = ref<LeafSwitchRack[]>([]);
    const spineLeafSwitchRack = ref<SpineLeafSwitchRack[]>([])
    const superSpineSwitchRack = ref<SuperSpineSwitchRack[]>([])
    const networkCabinet = ref<NetworkCabinet[]>([])
    const patchPanelModulePort = ref<PatchPanelModulePort[]>([])

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      },{
        name: "fiberCableType",
        required: true,
        label: "Fibercabletype",
        align: "left" as "left",
        field: "fiberCableType",
        sortable: true,
      },{
        name: "fiberTrunkCableCoreCount",
        required: true,
        label: "Fibertrunkcablecorecount",
        align: "left" as "left",
        field: "fiberTrunkCableCoreCount",
        sortable: true,
      },{
        name: "fiberTrunkCableSerialID",
        required: true,
        label: "Fibertrunkcableserialid",
        align: "left" as "left",
        field: "fiberTrunkCableSerialID",
        sortable: true,
      },{
        name: "fireRating",
        required: true,
        label: "Firerating",
        align: "left" as "left",
        field: "fireRating",
        sortable: true,
      },{
        name: "numberOfFiberCoresPerConnector",
        required: true,
        label: "Numberoffibercoresperconnector",
        align: "left" as "left",
        field: "numberOfFiberCoresPerConnector",
        sortable: true,
      },{
        name: "fibersPerSubUnit",
        required: true,
        label: "Fiberspersubunit",
        align: "left" as "left",
        field: "fibersPerSubUnit",
        sortable: true,
      },{
        name: "numberOfSubUnitsPerCable",
        required: true,
        label: "Numberofsubunitspercable",
        align: "left" as "left",
        field: "numberOfSubUnitsPerCable",
        sortable: true,
      },{
        name: "fiberTrunkCableDiameter",
        required: true,
        label: "Fibertrunkcablediameter",
        align: "left" as "left",
        field: "fiberTrunkCableDiameter",
        sortable: true,
      },{
        name: "numberOfLegsInTrunk",
        required: true,
        label: "Numberoflegsintrunk",
        align: "left" as "left",
        field: "numberOfLegsInTrunk",
        sortable: true,
      },{
        name: "lengthOfLegBreakout",
        required: true,
        label: "Lengthoflegbreakout",
        align: "left" as "left",
        field: "lengthOfLegBreakout",
        sortable: true,
      },{
        name: "apcConnector",
        required: true,
        label: "Apcconnector",
        align: "left" as "left",
        field: "apcConnector",
        sortable: true,
      },{
        name: "legLabelnumber",
        required: true,
        label: "Leglabelnumber",
        align: "left" as "left",
        field: "legLabelnumber",
        sortable: true,
      },{
        name: "cableLength",
        required: true,
        label: "Cablelength",
        align: "left" as "left",
        field: "cableLength",
        sortable: true,
      },{
        name: "redundantFiberFeeds",
        required: true,
        label: "Redundantfiberfeeds",
        align: "left" as "left",
        field: "redundantFiberFeeds",
        sortable: true,
      },{
        name: "deliveredToProject",
        required: true,
        label: "Deliveredtoproject",
        align: "left" as "left",
        field: "deliveredToProject",
        sortable: true,
      },{
        name: "cablePulled",
        required: true,
        label: "Cablepulled",
        align: "left" as "left",
        field: "cablePulled",
        sortable: true,
      },{
        name: "cablePlugged",
        required: true,
        label: "Cableplugged",
        align: "left" as "left",
        field: "cablePlugged",
        sortable: true,
      },{
        name: "cableTested",
        required: true,
        label: "Cabletested",
        align: "left" as "left",
        field: "cableTested",
        sortable: true,
      },{
        name: "zoneId",
        required: true,
        label: "Zone",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.zone?.name || zone.value.find((z) => z.id === row.zoneId)?.name || "N/A",
        sortable: true,
      },{
        name: "patchPanelModulePortId",
        required: true,
        label: "PatchPanelModulePortId",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.patchPanelModulePort?.portLocationFrontOrBack || patchPanelModulePort.value.find((pPMP) => pPMP.id === row.patchPanelModulePortId)?.portLocationFrontOrBack || "N/A",
        sortable: true,
      },
      {
        name: "networkCabinetId",
        required: true,
        label: "NetworkCabinet",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.networkCabinet?.name || networkCabinet.value.find((n) => n.id === row.networkCabinetId)?.name || "N/A",
        sortable: true,
      },{
        name: "gpuComputeRackd",
        required: true,
        label: "Gpu Compute Rack",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.gpuComputeRack?.name ||
          gpuComputeRack.value.find((gPR) => gPR.id === row.gpuComputeRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "cpuComputeRackd",
        required: true,
        label: "Cpu Compute Rack",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.cpuComputeRack?.name ||
          cpuComputeRack.value.find((cPR) => cPR.id === row.cpuComputeRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "leafSwitchRackId",
        required: true,
        label: "Leaf Switch Rack",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.leafSwitchRack?.name || leafSwitchRack.value.find((lSR) => lSR.id === row.leafSwitchRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "spineLeafSwitchRackId",
        required: true,
        label: "Spine Leaf Switch Rack",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
          row.spineLeafSwitchRack?.name || spineLeafSwitchRack.value.find((sLS) => sLS.id === row.spineLeafSwitchRackId)?.name || "N/A",
        sortable: true,
      },{
        name: "superSpineSwitchRackId",
        required: true,
        label: "Super Spine Switch Rack",
        align: "left" as "left",
        field: (row: FiberTrunkCable) =>
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
      fiberTrunkCableId: null as number | null,
    });

    const form = ref<Partial<FiberTrunkCable>>({});

    const isFormValid = computed(() => {
      return form.value !== undefined;
    });


    const networkCabinetOptions = computed(() =>
    networkCabinet.value.map((networkCabinetMap) => ({
        label: networkCabinetMap.name,
        value: networkCabinetMap.id,
      }))
    );

    const patchPanelModulePortOptions = computed(() =>
    patchPanelModulePort.value.map((patchPanelModulePortMap) => ({
        label: patchPanelModulePortMap.portLocationFrontOrBack,
        value: patchPanelModulePortMap.id,
      }))
    );

    const gpuComputeRackOptions = computed(() =>
    gpuComputeRack.value.map((gpuComputeRackMap) => ({
        label: gpuComputeRackMap.name,
        value: gpuComputeRackMap.id,
      }))
    );

    const cpuComputeRackOptions = computed(() =>
    cpuComputeRack.value.map((cpuComputeRackMap) => ({
        label: cpuComputeRackMap.name,
        value: cpuComputeRackMap.id,
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


    const deleteConfirmMessage = computed(() => {
      return selectedFiberTrunkCables.value.length > 0
        ? `Are you sure you want to delete ${selectedFiberTrunkCables.value.length} fiberTrunkCable(s)?`
        : "Are you sure you want to delete this fiberTrunkCable?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
      };
    };

    const fetchFiberTrunkCables = async () => {
      loading.value = true;
      try {
        fiberTrunkCables.value = await fiberTrunkCableService
        .getFiberTrunkCablesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch fiberTrunkCables:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
  try {
    console.log('Fetching related data...');

    // Fetching related data for the different entities
    const [
      fetchedNetworkCabinet,
      fetchedPatchPanelModulePort,
      fetchedCpuComputeRacks,
      fetchedGpuComputeRacks,
      fetchedZones,
      fetchedLeafSwitchRacks,
      fetchedSpineLeafSwitchRacks,
      fetchedSuperSpineSwitchRacks,
    ] = await Promise.all([
      networkCabinetService.getNetworkCabinetsByCustomerAndDataHallId(customerId, dataHallId),
      patchPanelModulePortService.getPatchPanelModulePortsByCustomerAndDataHallId(customerId, dataHallId),
      cpuComputeRackService.getCpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      gpuComputeRackService.getGpuComputeRacksByCustomerAndDataHallId(customerId, dataHallId),
      zoneService.getZonesByCustomerAndDataHallId(customerId, dataHallId),
      leafSwitchRackService.getLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      spineLeafSwitchRackService.getSpineLeafSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
      superSpineSwitchRackService.getSuperSpineSwitchRacksByCustomerAndDataHallId(customerId, dataHallId),
    ]);

    // Logging the fetched data for debugging
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedNetworkCabinet, null, 2));
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedPatchPanelModulePort, null, 2));
    console.log('Fetched CpuComputeRacks:', JSON.stringify(fetchedCpuComputeRacks, null, 2));
    console.log('Fetched GpuComuteRacks:', JSON.stringify(fetchedGpuComputeRacks, null, 2));
    console.log('Fetched Zones:', JSON.stringify(fetchedZones, null, 2));
    console.log('Fetched LeafSwitchRacks:', JSON.stringify(fetchedLeafSwitchRacks, null, 2));
    console.log('Fetched SpineLeafSwitchRacks:', JSON.stringify(fetchedSpineLeafSwitchRacks, null, 2));
    console.log('Fetched SuperSpineSwitchRacks:', JSON.stringify(fetchedSuperSpineSwitchRacks, null, 2));

    // Storing fetched data in respective reactive variables
    networkCabinet.value = fetchedNetworkCabinet;
    patchPanelModulePort.value = fetchedPatchPanelModulePort;
    cpuComputeRack.value = fetchedCpuComputeRacks;
    gpuComputeRack.value = fetchedGpuComputeRacks;
    zone.value = fetchedZones;
    leafSwitchRack.value = fetchedLeafSwitchRacks;
    spineLeafSwitchRack.value = fetchedSpineLeafSwitchRacks;
    superSpineSwitchRack.value = fetchedSuperSpineSwitchRacks;

    // Logging the options for debugging
    console.log('NetworkCabinet Options:', JSON.stringify(networkCabinetOptions.value, null, 2));
    console.log('patchpanelModulePortOptions Options:', JSON.stringify(patchPanelModulePortOptions.value, null, 2));
    console.log('CpuComputeRacks Options:', JSON.stringify(cpuComputeRackOptions.value, null, 2));
    console.log('GpuComputeRacks Options:', JSON.stringify(gpuComputeRackOptions.value, null, 2));
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
        title: "Create New FiberTrunkCable",
        mode: "create",
      };
    };

    const openEditDialog = (fiberTrunkCable: FiberTrunkCable) => {
      form.value = { ...fiberTrunkCable };
      dialog.value = {
        show: true,
        title: "Edit FiberTrunkCable",
        mode: "edit",
      };
      deleteDialog.value.fiberTrunkCableId = fiberTrunkCable.id;
    };

    const confirmDelete = (fiberTrunkCableId: number) => {
      deleteDialog.value = {
        show: true,
        fiberTrunkCableId: fiberTrunkCableId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };


    const filteredFiberTrunkCables = computed(() => {
  return fiberTrunkCables.value.filter((fiberTrunkCable) => {
    const searchTerm = filter.value.trim().toLowerCase();

    // Combine all relevant fields into a single string
    const combinedFields = [
      // fiberTrunkCable.id.toString(),
      fiberTrunkCable.name.toLowerCase(),
      fiberTrunkCable.fiberCableType.toLowerCase(),
      fiberTrunkCable.fiberTrunkCableCoreCount.toLowerCase(),
      fiberTrunkCable.fiberTrunkCableSerialID.toLowerCase(),
      fiberTrunkCable.fireRating.toLowerCase(),
      fiberTrunkCable.numberOfFiberCoresPerConnector.toString(),
      fiberTrunkCable.fibersPerSubUnit.toString(),
      fiberTrunkCable.numberOfSubUnitsPerCable.toString(),
      fiberTrunkCable.fiberTrunkCableDiameter.toString(),
      fiberTrunkCable.numberOfLegsInTrunk.toString(),
      fiberTrunkCable.lengthOfLegBreakout.toString(),
      fiberTrunkCable.apcConnector.toString(),
      fiberTrunkCable.legLabelnumber.toLowerCase(),
      fiberTrunkCable.cableLength.toString(),
      fiberTrunkCable.redundantFiberFeeds.toString(),
      fiberTrunkCable.deliveredToProject.toString(),
      fiberTrunkCable.cablePulled.toString(),
      fiberTrunkCable.cablePlugged.toString(),
      fiberTrunkCable.cableTested.toString(),

      // Related entity fields
      fiberTrunkCable.customer?.name?.toLowerCase() || "",
      fiberTrunkCable.dataHall?.name?.toLowerCase() || "",
      fiberTrunkCable.networkCabinet?.name?.toLowerCase() || "",
      fiberTrunkCable.zone?.name?.toLowerCase() || "",
      fiberTrunkCable.gpuComputeRack?.name?.toLowerCase() || "",
      fiberTrunkCable.cpuComputeRack?.name?.toLowerCase() || "",
      fiberTrunkCable.leafSwitchRack?.name?.toLowerCase() || "",
      fiberTrunkCable.spineLeafSwitchRack?.name?.toLowerCase() || "",
      fiberTrunkCable.superSpineSwitchRack?.name?.toLowerCase() || "",
      fiberTrunkCable.patchPanelModulePort?.portLocationFrontOrBack?.toLowerCase() || ""
    ]
      .join(" ")       // Combine into a single string
      .toLowerCase();  // Convert to lowercase for case insensitivity

    // Check if search term exists in the combined fields
    return combinedFields.includes(searchTerm);
  });
});

    const handleSubmit = async () => {
  try {
    const submitData = {
         

          redundantFiberFeeds: form.value.redundantFiberFeeds ?? false,
          deliveredToProject : form.value.deliveredToProject ?? false,
          cablePulled: form.value.cablePulled ?? false,
          cablePlugged: form.value. cablePlugged?? false,
          cableTested: form.value.cableTested ?? false,
          apcConnector: form.value.apcConnector ?? false,
            

          name: form.value.name,
          fiberCableType: form.value.fiberCableType,
          fiberTrunkCableCoreCount: form.value.fiberTrunkCableCoreCount,
          fiberTrunkCableSerialID: form.value.fiberTrunkCableSerialID,
          fireRating: form.value.legLabelnumber,
          legLabelnumber:form.value.legLabelnumber,

          numberOfFiberCoresPerConnector : Number(form.value.numberOfFiberCoresPerConnector),
          fibersPerSubUnit: Number(form.value.fibersPerSubUnit),
          numberOfSubUnitsPerCable: Number(form.value.numberOfSubUnitsPerCable),
          fiberTrunkCableDiameter: Number(form.value.fiberTrunkCableDiameter),
          numberOfLegsInTrunk: Number(form.value.numberOfLegsInTrunk),
          lengthOfLegBreakout: Number(form.value.lengthOfLegBreakout),
          cableLength: Number(form.value.cableLength),


          customerId: Number(form.value.customerId),
          dataHallId: Number(form.value.dataHallId),

          networkCabinetId: Number(form.value.networkCabinetId),
          patchPanelModulePortId: Number(form.value.patchPanelModulePortId),
          zoneId: Number(form.value.zoneId),
          gpuComputeRackId: Number(form.value.gpuComputeRackId),
          cpuComputeRackId: Number(form.value.cpuComputeRackId),
          leafSwitchRackId: Number(form.value.leafSwitchRackId),
          spineLeafSwitchRackId: Number(form.value.spineLeafSwitchRackId),
          superSpineSwitchRackId: Number(form.value.superSpineSwitchRackId),
    };

    // Handle create or update based on the mode
    if (dialog.value.mode === "create") {
      await fiberTrunkCableService.createFiberTrunkCable(submitData);
    } else {
      if (deleteDialog.value.fiberTrunkCableId) {
        await fiberTrunkCableService.updateFiberTrunkCable(
          deleteDialog.value.fiberTrunkCableId,
          submitData
        );
      }
    }

    dialog.value.show = false;
    await fetchFiberTrunkCables();
    emit("fiberTrunkCable-updated");
  } catch (error) {
    console.error(`Failed to ${dialog.value.mode} fiber Trunk Cable:`, error);
  }
};
    const handleDelete = async () => {
      try {
        if (selectedFiberTrunkCables.value.length > 0) {
          for (const fiberTrunkCable of selectedFiberTrunkCables.value) {
            await fiberTrunkCableService.deleteFiberTrunkCable(fiberTrunkCable.id);
          }
          selectedFiberTrunkCables.value = [];
        } else if (deleteDialog.value.fiberTrunkCableId) {
          await fiberTrunkCableService.deleteFiberTrunkCable(deleteDialog.value.fiberTrunkCableId);
        }
        await fetchFiberTrunkCables();
        emit("fiberTrunkCable-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete fiberTrunkCable(s):", error);
      }
    };

    onMounted(() => {
      fetchFiberTrunkCables();
      fetchRelatedData();
    });

    return {
      loading,
      fiberTrunkCables,
      filteredFiberTrunkCables,

      networkCabinetOptions,
      patchPanelModulePortOptions,
      gpuComputeRackOptions,
      cpuComputeRackOptions,
      zoneOptions,
      leafSwitchRackOptions,
      spineLeafSwitchRackOptions,
      superSpineSwitchRackOptions,

      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedFiberTrunkCables,
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