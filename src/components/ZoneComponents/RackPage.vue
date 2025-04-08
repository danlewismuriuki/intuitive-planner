<template>
  <div class="rack-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Racks
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      item-name="Rack"
      v-model:search-term="filter"
      :has-selected="selectedRacks.length > 0"
      @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected"
      />

    <!-- Data Table Component -->
    <DataTable
    :rows="racks"
    :columns="columns"
    :loading="loading"
    v-model:selected="selectedRacks"
    @edit="openEditDialog"
    @delete="confirmDelete" />

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
        required
        :rules="[(val) => !!val || 'Name is required']"
        placeholder="Enter name"
        />

        <q-select
        v-model="form.rackTypeId"
        :options="rackTypeOptions"
        label="Rack Type"
        dark
        outlined
        required
        :rules="[(val) => !!val || 'Rack Type is required']"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        @update:model-value="val => console.log('RackType selected:', val)" />

        <q-select v-model="form.zoneId" :options="zoneOptions" label="Zone" dark outlined required
          :rules="[(val) => !!val || 'Zone is required']" option-value="value" option-label="label" emit-value
          map-options @update:model-value="val => console.log('Zone selected:', val)" />

        <q-select v-model="form.superSpineZoneId" :options="superSpineZoneOptions" label="Super Spine Zone" dark
          outlined required :rules="[(val) => !!val || 'Super Spine Zone is required']" option-value="value"
          option-label="label" emit-value map-options
          @update:model-value="val => console.log('SuperSpineZone selected:', val)" />
      </q-form>
    </FormDialog>

    <!-- Confirmation Dialog Component -->
    <ConfirmationDialog
    v-model="deleteDialog.show"
    :message="deleteConfirmMessage"
    confirm-label="DELETE"
      @confirm="handleDelete" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { Rack, RackType, Zone, SuperSpineZone } from "src/types/models";
import { rackService } from "src/services/rackService";
import { rackTypeService } from "src/services/rackTypeService";
import { zoneService } from "src/services/zoneService";
import { superSpineZoneService } from "src/services/superSpineZoneService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "RackList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["rack-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const racks = ref<Rack[]>([]);
    const rackTypes = ref<RackType[]>([]);
    const zones = ref<Zone[]>([]);
    const superSpineZones = ref<SuperSpineZone[]>([]);
    const filter = ref("");
    const selectedRacks = ref<Rack[]>([]);

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
        name: "rackTypeId",
        required: true,
        label: "Rack Type",
        align: "left" as "left",
        field: (row: Rack & { RackType: { name: string } }) =>
          row.RackType?.name || "N/A",
        sortable: true,
      },
      {
        name: "zoneId",
        required: true,
        label: "Zone",
        align: "left" as "left",
        field: (row: Rack & { zone: { name: string } }) =>
          row.zone?.name || "N/A",
        sortable: true,
      },
      {
        name: "superSpineZoneId",
        required: true,
        label: "Super Spine Zone",
        align: "left" as "left",
        field: (row: Rack & { superSpineZone: { name: string } }) =>
          row.superSpineZone?.name || "N/A",
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
      rackId: null as number | null,
    });

    const form = ref<Partial<Rack>>({});

    const isFormValid = computed(() => {
      return !!(form.value.name?.trim() &&
        form.value.rackTypeId &&
        form.value.zoneId &&
        form.value.superSpineZoneId);
    });

    const deleteConfirmMessage = computed(() => {
      return selectedRacks.value.length > 0
        ? `Are you sure you want to delete ${selectedRacks.value.length} rack(s)?`
        : "Are you sure you want to delete this rack?";
    });

    const rackTypeOptions = computed(() =>
      rackTypes.value.map((type) => ({
        label: type.name,
        value: type.id,
      }))
    );

    const zoneOptions = computed(() =>
      zones.value.map((zone) => ({
        label: zone.name,
        value: zone.id,
      }))
    );

    const superSpineZoneOptions = computed(() =>
      superSpineZones.value.map((zone) => ({
        label: zone.name,
        value: zone.id,
      }))
    );

    const resetFormData = () => {
      form.value = {
        name: '',
        customerId: customerId,
        dataHallId: dataHallId,
        rackTypeId: null,
        zoneId: null,
        superSpineZoneId: null
      };
    };

    const fetchRacks = async () => {
      loading.value = true;
      try {
        racks.value = await rackService.getRacksByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch racks:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchRelatedData = async () => {
      try {
        console.log('Fetching related data...');
        const [fetchedRackTypes, fetchedZones, fetchedSuperSpineZones] = await Promise.all([
          rackTypeService.getAllRackTypes(),
          zoneService.getZonesByCustomerAndDataHallId(customerId, dataHallId),
          superSpineZoneService.getSuperSpineZonesByCustomerAndDataHallId(customerId, dataHallId),
        ]);

        console.log('Fetched RackTypes:', JSON.stringify(fetchedRackTypes, null, 2));
        console.log('Fetched Zones:', JSON.stringify(fetchedZones, null, 2));
        console.log('Fetched SuperSpineZones:', JSON.stringify(fetchedSuperSpineZones, null, 2));

        rackTypes.value = fetchedRackTypes;
        zones.value = fetchedZones;
        superSpineZones.value = fetchedSuperSpineZones;

        console.log('RackType Options:', JSON.stringify(rackTypeOptions.value, null, 2));
        console.log('Zone Options:', JSON.stringify(zoneOptions.value, null, 2));
        console.log('SuperSpineZone Options:', JSON.stringify(superSpineZoneOptions.value, null, 2));
      } catch (error) {
        console.error("Failed to fetch related data:", error);
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Rack",
        mode: "create",
      };
    };

    const openEditDialog = (rack: Rack) => {
      form.value = { ...rack };
      dialog.value = {
        show: true,
        title: "Edit Rack",
        mode: "edit",
      };
      deleteDialog.value.rackId = rack.id;
    };

    const confirmDelete = (rackId: number) => {
      deleteDialog.value = {
        show: true,
        rackId: rackId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (!form.value.name?.trim()) {
          console.error('Name is required');
          return;
        }

        if (!form.value.rackTypeId || !form.value.zoneId || !form.value.superSpineZoneId) {
          console.log('Form values:', form.value);
          console.error('All fields are required:', {
            rackTypeId: form.value.rackTypeId,
            zoneId: form.value.zoneId,
            superSpineZoneId: form.value.superSpineZoneId
          });
          return;
        }

        const submitData = {
          name: form.value.name.trim(),
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
          rackTypeId: Number(form.value.rackTypeId),
          zoneId: Number(form.value.zoneId),
          superSpineZoneId: Number(form.value.superSpineZoneId),
        };

        if (dialog.value.mode === "create") {
          await rackService.createRack(submitData);
        } else {
          if (deleteDialog.value.rackId) {
            await rackService.updateRack(deleteDialog.value.rackId, submitData);
          }
        }

        dialog.value.show = false;
        await fetchRacks();
        emit("rack-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} rack:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedRacks.value.length > 0) {
          for (const rack of selectedRacks.value) {
            await rackService.deleteRack(rack.id);
          }
          selectedRacks.value = [];
        } else if (deleteDialog.value.rackId) {
          await rackService.deleteRack(deleteDialog.value.rackId);
        }
        await fetchRacks();
        emit("rack-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete rack(s):", error);
      }
    };

    onMounted(() => {
      fetchRacks();
      fetchRelatedData();
    });

    return {
      loading,
      racks,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedRacks,
      deleteConfirmMessage,
      isFormValid,
      rackTypeOptions,
      zoneOptions,
      superSpineZoneOptions,
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
