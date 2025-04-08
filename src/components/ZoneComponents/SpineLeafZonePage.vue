<template>
  <div class="spine-leaf-zone-management q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Spine Leaf Zones
    </div>

    <!-- Search Header Component -->
    <SearchHeader item-name="Spine Leaf Zone" v-model:search-term="filter"
      :has-selected="selectedSpineLeafZones.length > 0" @add="openCreateDialog"
      @delete-selected="confirmDeleteSelected" />

    <!-- Data Table Component -->
    <DataTable :rows="spineLeafZones" :columns="columns" :loading="loading" v-model:selected="selectedSpineLeafZones"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog Component -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="dialog.show = false">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined required
          :rules="[(val) => !!val || 'Name is required']" placeholder="Enter name" />
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
import { SpineLeafZone } from "src/types/models";
import { spineLeafZoneService } from "src/services/spineLeafZoneService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SpineLeafZoneList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  emits: ["spineLeafZone-updated"],

  setup(_, { emit }) {
    const route = useRoute();
    const customerId = Number(route.query.customerId);
    const dataHallId = Number(route.path.split("/")[2]);
    const loading = ref(false);
    const spineLeafZones = ref<SpineLeafZone[]>([]);
    const filter = ref("");
    const selectedSpineLeafZones = ref<SpineLeafZone[]>([]);

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left" as "left",
        field: "name",
        sortable: true,
      }
    ];

    const dialog = ref({
      show: false,
      title: "",
      mode: "create",
    });

    const deleteDialog = ref({
      show: false,
      spineLeafZoneId: null as number | null,
    });

    const form = ref<Partial<SpineLeafZone>>({});

    const isFormValid = computed(() => {
      return form.value.name?.trim() !== "";
    });

    const deleteConfirmMessage = computed(() => {
      return selectedSpineLeafZones.value.length > 0
        ? `Are you sure you want to delete ${selectedSpineLeafZones.value.length} spine leaf zone(s)?`
        : "Are you sure you want to delete this spine leaf zone?";
    });

    const resetFormData = () => {
      form.value = {
        customerId: customerId,
        dataHallId: dataHallId,
        name: "",
      };
    };

    const fetchSpineLeafZones = async () => {
      loading.value = true;
      try {
        spineLeafZones.value = await spineLeafZoneService.getSpineLeafZonesByCustomerAndDataHallId(
          customerId,
          dataHallId
        );
      } catch (error) {
        console.error("Failed to fetch spine leaf zones:", error);
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      resetFormData();
      dialog.value = {
        show: true,
        title: "Create New Spine Leaf Zone",
        mode: "create",
      };
    };

    const openEditDialog = (spineLeafZone: SpineLeafZone) => {
      form.value = { ...spineLeafZone };
      dialog.value = {
        show: true,
        title: "Edit Spine Leaf Zone",
        mode: "edit",
      };
      deleteDialog.value.spineLeafZoneId = spineLeafZone.id;
    };

    const confirmDelete = (spineLeafZoneId: number) => {
      deleteDialog.value = {
        show: true,
        spineLeafZoneId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        const submitData = {
          name: form.value.name,
          customerId: Number(customerId),
          dataHallId: Number(dataHallId),
        };

        if (dialog.value.mode === "create") {
          await spineLeafZoneService.createSpineLeafZone(submitData);
        } else {
          if (deleteDialog.value.spineLeafZoneId) {
            await spineLeafZoneService.updateSpineLeafZone(
              deleteDialog.value.spineLeafZoneId,
              submitData
            );
          }
        }

        dialog.value.show = false;
        await fetchSpineLeafZones();
        emit("spineLeafZone-updated");
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} spine leaf zone:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedSpineLeafZones.value.length > 0) {
          for (const zone of selectedSpineLeafZones.value) {
            await spineLeafZoneService.deleteSpineLeafZone(zone.id);
          }
          selectedSpineLeafZones.value = [];
        } else if (deleteDialog.value.spineLeafZoneId) {
          await spineLeafZoneService.deleteSpineLeafZone(deleteDialog.value.spineLeafZoneId);
        }
        await fetchSpineLeafZones();
        emit("spineLeafZone-updated");
        deleteDialog.value.show = false;
      } catch (error) {
        console.error("Failed to delete spine leaf zone(s):", error);
      }
    };

    onMounted(() => {
      fetchSpineLeafZones();
    });

    return {
      loading,
      spineLeafZones,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      selectedSpineLeafZones,
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
