<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md" v-if="loading">
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
    <div class="row q-col-gutter-md" v-else>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <Projects :customer="customer" @project-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <Sites :customer="customer" @site-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <Buildings :customerId="customerId" @building-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <Floors :customerId="customerId" @floor-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <NetworkRooms :customerId="customerId" @floor-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <MeetMeRooms :customerId="customerId" @floor-updated="fetchData" />
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <DataHalls :customerId="customerId" @floor-updated="fetchData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Customer } from "../../../types/models"
import { customerService } from "../../../services/customerService";
import Buildings from "../BuildingList.vue";
import DataHalls from "../DataHallList.vue";
import Floors from "../FloorList.vue";
import Projects from "../ProjectList.vue";
import Sites from "../SiteList.vue";
import NetworkRooms from "../NetworkRoomList.vue";
import MeetMeRooms from "../MeetMeRoomList.vue";

export default defineComponent({
  name: "CustomerOverview",
  components: {
    Projects,
    Sites,
    Buildings,
    Floors,
    NetworkRooms,
    MeetMeRooms,
    DataHalls,
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const customer = ref<Customer>({} as Customer);
    const loading = ref<boolean>(true);

    const fetchData = async () => {
      try {
        loading.value = true;
        customer.value = await customerService.getCustomerById(
          props.customerId
        );
        loading.value = false;
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      customer,
      loading,
      fetchData,
    };
  },
});
</script>
