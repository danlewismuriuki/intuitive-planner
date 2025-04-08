<template>
  <div class="q-pa-md" style="background: #2d2d3a; color: white">
    <!-- Header -->
    <div class="text-h4 q-mb-lg text-weight-light">Super Spine Zones</div>

    <!-- Search and Action Header -->
    <SearchHeader item-name="Super Spine Zone" v-model:search-term="filter" :has-selected="selectedItems.length > 0"
      @add="openCreateDialog" @delete-selected="confirmDeleteSelected" />

    <!-- Data Table -->
    <DataTable :rows="filteredItems" :columns="columns" :loading="loading" v-model:selected="selectedItems"
      @edit="openEditDialog" @delete="confirmDelete" />

    <!-- Form Dialog -->
    <FormDialog v-model="dialog.show" :title="dialog.title" :is-valid="isFormValid" @save="handleSubmit"
      @cancel="closeDialog">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model.trim="form.name" label="Name" dark outlined :rules="[(val) => !!val || 'Name is required']"
          lazy-rules />
      </q-form>
    </FormDialog>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog v-model="deleteDialog.show" :message="deleteConfirmMessage" confirm-label="DELETE"
      @confirm="handleDelete" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, PropType } from 'vue';
import { SuperSpineZone } from 'src/types/models';
import { superSpineZoneService } from 'src/services/superSpineZoneService';
import SearchHeader from '../FormComponents/SearchHeader.vue';
import DataTable from '../FormComponents/DataTable.vue';
import FormDialog from '../FormComponents/FormDialog.vue';
import ConfirmationDialog from '../FormComponents/ConfirmationDialog.vue';

export default defineComponent({
  name: 'SuperSpineZonePage',

  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },

  props: {
    customerId: {
      type: Number as PropType<number>,
      required: true,
    },
    dataHallId: {
      type: Number as PropType<number>,
      required: true,
    },
  },

  emits: ['zone-updated'],

  setup(props, { emit }) {
    const loading = ref(false);
    const items = ref<SuperSpineZone[]>([]);
    const selectedItems = ref<SuperSpineZone[]>([]);
    const filter = ref('');

    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left' as const,
        field: 'name',
        sortable: true,
      },
    ];

    const dialog = ref({
      show: false,
      title: '',
      mode: 'create',
      currentId: null as number | null,
    });

    const deleteDialog = ref({
      show: false,
      itemId: null as number | null,
    });

    const form = ref<Partial<SuperSpineZone>>({});

    // Computed properties
    const filteredItems = computed(() => {
      if (!filter.value) return items.value;
      const searchTerm = filter.value.toLowerCase();
      return items.value.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
      );
    });

    const isFormValid = computed(() => {
      return !!form.value.name;
    });

    const deleteConfirmMessage = computed(() => {
      return selectedItems.value.length > 0
        ? `Are you sure you want to delete ${selectedItems.value.length} super spine zone(s)?`
        : 'Are you sure you want to delete this super spine zone?';
    });

    // Methods
    const fetchItems = async () => {
      loading.value = true;
      try {
        items.value = await superSpineZoneService.getSuperSpineZonesByCustomerAndDataHallId(
          props.customerId,
          props.dataHallId
        );
      } catch (error) {
        console.error('Failed to fetch super spine zones:', error);
      } finally {
        loading.value = false;
      }
    };

    const resetForm = () => {
      form.value = {
        name: '',
        customerId: props.customerId,
        dataHallId: props.dataHallId,
      };
      dialog.value.currentId = null;
    };

    const openCreateDialog = () => {
      resetForm();
      dialog.value = {
        show: true,
        title: 'Create New Super Spine Zone',
        mode: 'create',
        currentId: null,
      };
    };

    const openEditDialog = (item: SuperSpineZone) => {
      form.value = {
        name: item.name,
        customerId: props.customerId,
        dataHallId: props.dataHallId,
      };
      dialog.value = {
        show: true,
        title: 'Edit Super Spine Zone',
        mode: 'edit',
        currentId: item.id,
      };
    };

    const closeDialog = () => {
      dialog.value.show = false;
      resetForm();
    };

    const confirmDelete = (itemId: number) => {
      deleteDialog.value = {
        show: true,
        itemId,
      };
    };

    const confirmDeleteSelected = () => {
      deleteDialog.value.show = true;
    };

    const handleSubmit = async () => {
      try {
        if (dialog.value.mode === 'create') {
          await superSpineZoneService.createSuperSpineZone({
            name: form.value.name!,
            customerId: props.customerId,
            dataHallId: props.dataHallId,
          });
        } else if (dialog.value.currentId) {
          await superSpineZoneService.updateSuperSpineZone(
            dialog.value.currentId,
            {
              name: form.value.name!,
              customerId: props.customerId,
              dataHallId: props.dataHallId,
            }
          );
        }
        await fetchItems();
        emit('zone-updated');
        closeDialog();
      } catch (error) {
        console.error(`Failed to ${dialog.value.mode} super spine zone:`, error);
      }
    };

    const handleDelete = async () => {
      try {
        if (selectedItems.value.length > 0) {
          await Promise.all(
            selectedItems.value.map(item =>
              superSpineZoneService.deleteSuperSpineZone(item.id)
            )
          );
          selectedItems.value = [];
        } else if (deleteDialog.value.itemId) {
          await superSpineZoneService.deleteSuperSpineZone(deleteDialog.value.itemId);
        }
        await fetchItems();
        emit('zone-updated');
        deleteDialog.value.show = false;
      } catch (error) {
        console.error('Failed to delete super spine zone(s):', error);
      }
    };

    onMounted(() => {
      fetchItems();
    });

    return {
      loading,
      items,
      filteredItems,
      selectedItems,
      columns,
      filter,
      dialog,
      deleteDialog,
      form,
      deleteConfirmMessage,
      isFormValid,
      openCreateDialog,
      openEditDialog,
      closeDialog,
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
</style>
