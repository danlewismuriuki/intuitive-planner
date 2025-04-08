<template>
  <q-page class="">
    <div class="row q-justify-center">
      <div class="col-xs-6 col-md-4 col-lg-3 col-xl-2 flex flex-center q-py-sm">
        <dashboard-card
          :title="'Projects'"
          :progress-count="13"
          :navigation-route="'projects'"
        />
      </div>
      <div class="col-xs-6 col-md-4 col-lg-3 col-xl-2 flex flex-center q-py-sm">
        <dashboard-card
          :title="'Customers'"
          :progress-count="26"
          :navigation-route="'customers'"
        />
      </div>
      <div class="col-xs-6 col-md-4 col-lg-3 col-xl-2 flex flex-center q-py-sm">
        <dashboard-card
          :title="'Buildings'"
          :progress-count="51"
          :navigation-route="'buildings'"
        />
      </div>
      <div class="col-xs-6 col-md-4 col-lg-3 col-xl-2 flex flex-center q-py-sm">
        <dashboard-card
          :title="'Data Centers'"
          :progress-count="62"
          :navigation-route="'datacenters'"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DashboardCard from "../components/DashboardCard.vue";
defineOptions({
  name: "IndexPage",
});
</script>
