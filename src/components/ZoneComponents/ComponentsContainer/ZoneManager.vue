<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md" v-if="loading">
      <div class="col-12">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
    <div class="row q-col-gutter-md" v-else>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ZoneTypePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-type-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ZonePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <PatchPanelModulePortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SuperSpineSwitchRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <FiberTrunkCablePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ScalableUnitZonePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <StorageUnitZonePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SuperSpineZonePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SpineLeafZonePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <RackTypePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <RackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <RackUnitPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <FiberTransceiverTypePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <LeafSwitchRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <FiberTrunkCableLegPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <GpuComputeRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <CpuComputeRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ServerPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <GpuPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkTopologyPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkTypePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <GpuFrontSidePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <GpuRearSidePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <GpuPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <PatchPanelPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <OcpRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <LeafSwitchPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SpineLeafSwitchPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SuperSpineLeafSwitchPage 
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkTypeSouthPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ScalableUnitGpuLeafSwitchRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <LeafSwitchPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <LeafSwitchGbicPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <CoolingPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ConnectivityPathPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <ContainmentPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SuperSpineSwitchPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SpineSwitchPortPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <SpineLeafSwitchRackPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkCabinetPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <PatchPanelPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <CablePage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkSwitchPage
          :customer-id="customerId"
          :data-hall-id="dataHallId"
          @zone-updated="handleUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import ZonePage from "../ZonePage.vue";
import ZoneTypePage from "../ZoneTypePage.vue";
import ScalableUnitZonePage from "../ScalableUnitZonePage.vue";
import StorageUnitZonePage from "../StorageUnitZonePage.vue";
import SuperSpineZonePage from "../SuperSpineZonePage.vue";
import SpineLeafZonePage from "../SpineLeafZonePage.vue";
import RackTypePage from "../RackTypePage.vue";
import RackPage from "../RackPage.vue";
import RackUnitPage from "../RackUnitPage.vue"
import NetworkSwitchPage from "../NetworkSwitchPage.vue";
import FiberTransceiverTypePage from "../FiberTransceiverTypePage.vue";
import FiberTrunkCableLegPage from "../FiberTrunkCableLegPage.vue";
import GpuComputeRackPage from "../GpuComputeRackPage.vue";
import CpuComputeRackPage from "../CpuComputeRackPage.vue";
import ServerPage from "../ServerPage.vue";
import GpuPage from "../GpuPage.vue";
import GpuFrontSidePage from "../GpuFrontSidePage.vue";
import GpuRearSidePage from "../GpuRearSidePage.vue";
import GpuPortPage from "../GpuPortPage.vue";
import PatchPanelPortPage from "../PatchPanelPortPage.vue";
import OcpRackPage from "../OcpRackPage.vue";
import LeafSwitchPortPage from "../LeafSwitchPortPage.vue";
import SpineLeafSwitchPage from "../SpineLeafSwitchPage.vue";
import SuperSpineLeafSwitchPage from "../SuperSpineLeafSwitchPage.vue";
import NetworkTypeSouthPage from "../NetworkTypeSouthPage.vue";
import ScalableUnitGpuLeafSwitchRackPage from "../ScalableUnitGpuLeafSwitchRackPage.vue";
import LeafSwitchGbicPortPage from "../LeafSwitchGbicPortPage.vue";
import CoolingPage from "../CoolingPage.vue";
import ConnectivityPathPage from "../ConnectivityPathPage.vue";
import ContainmentPage from "../ContainmentPage.vue";
import SuperSpineSwitchPortPage from "../SuperSpineSwitchPortPage.vue";
import SpineSwitchPortPage from "../SpineSwitchPortPage.vue";
import PatchPanelPage from "../PatchPanelPage.vue";
import PatchPanelModulePortPage from "../PatchPanelModulePortPage.vue";
import FiberTrunkCablePage from "../FiberTrunkCablePage.vue";
import LeafSwitchRackPage from "../LeafSwitchRackPage.vue";
import SuperSpineSwitchRackPage from "../SuperSpineSwitchRackPage.vue";
import LeafSwitchPage from "../LeafSwitchPage.vue";
import NetworkTypePage from "../NetworkTypePage.vue";
import NetworkTopologyPage from "../NetworkTopologyPage.vue";
import NetworkCabinetPage from "../NetworkCabinetPage.vue";
import SpineLeafSwitchRackPage from "../SpineLeafSwitchRackPage.vue";
import CablePage from "../CablePage.vue";

export default defineComponent({
  name: "ZoneManager",

  components: {
    ZoneTypePage,
    ZonePage,
    ScalableUnitZonePage,
    StorageUnitZonePage,
    SuperSpineZonePage,
    SpineLeafZonePage,
    RackTypePage,
    RackPage,
    RackUnitPage,
    NetworkSwitchPage,
    FiberTransceiverTypePage,
    FiberTrunkCableLegPage,
    GpuComputeRackPage,
    CpuComputeRackPage,
    ServerPage,
    GpuPage,
    GpuFrontSidePage,
    GpuRearSidePage,
    GpuPortPage,
    PatchPanelPortPage,
    OcpRackPage,
    LeafSwitchPortPage,
    SpineLeafSwitchPage,
    SuperSpineLeafSwitchPage,
    NetworkTypeSouthPage,
    ScalableUnitGpuLeafSwitchRackPage,
    LeafSwitchGbicPortPage,
    CoolingPage,
    ConnectivityPathPage,
    ContainmentPage,
    SuperSpineSwitchPortPage,
    SpineSwitchPortPage,
    PatchPanelPage,
    PatchPanelModulePortPage,
    FiberTrunkCablePage,
    LeafSwitchRackPage,
    SuperSpineSwitchRackPage,
    LeafSwitchPage,
    NetworkTypePage,
    NetworkTopologyPage,
    NetworkCabinetPage,
    SpineLeafSwitchRackPage,
    CablePage,
  },

  setup() {
    const route = useRoute();
    const loading = ref(true);

    // Debug raw route values
    console.log("Route params:", route.params);
    console.log("Route query:", route.query);

    const dataHallId = computed(() => {
      const id = route.params.dataHallId;
      console.log("Raw dataHallId:", id);
      if (!id) return 0;
      return Number(id);
    });

    const customerId = computed(() => {
      // For URL query ?customerId=1
      const id = route.query.customerId;
      console.log("Raw customerId:", id);
      if (!id) return 0;
      return Number(id);
    });

    const handleUpdate = () => {
      console.log("Zone or ZoneType updated");
    };

    onMounted(() => {
      console.log("Mounted with dataHallId:", dataHallId.value);
      console.log("Mounted with customerId:", customerId.value);

      if (!dataHallId.value || !customerId.value) {
        console.error("Invalid dataHallId or customerId");
      }
      loading.value = false;
    });

    return {
      loading,
      dataHallId,
      customerId,
      handleUpdate,
    };
  },
});
</script>
