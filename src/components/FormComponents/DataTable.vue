<template>
  <q-table :rows="rows" :columns="columns" row-key="id" :loading="loading" selection="multiple"
    v-model:selected="localSelected" :pagination="{ rowsPerPage: 10 }" dark
    style="background: rgba(255, 255, 255, 0.05); border-radius: 12px" :table-style="{ color: 'white' }"
    :separator="'cell'">
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width>
          <q-checkbox v-model="props.selected" dark color="orange" />
        </q-th>
        <q-th v-for="col in props.cols" :key="col.name" :props="props" style="color: orange; font-weight: 500">
          {{ col.label }}
        </q-th>
        <q-th auto-width style="color: orange"> Actions </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" :class="{ 'cursor-pointer': true, 'hover-row': true }"
        @click="$emit('row-click', props.row.id)" v-ripple>
        <q-td auto-width @click.stop>
          <q-checkbox v-model="props.selected" dark color="orange" />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props" style="color: #e0e0e0">
          {{ col.value }}
        </q-td>
        <q-td auto-width @click.stop>
          <q-btn flat round color="orange" icon="edit" @click="$emit('edit', props.row)"
            :disable="localSelected.length > 0" :style="{ opacity: localSelected.length > 0 ? 0.5 : 1 }" />
          <q-btn flat round color="grey" icon="delete" @click="$emit('delete', props.row.id)"
            :disable="localSelected.length > 0" :style="{ opacity: localSelected.length > 0 ? 0.5 : 1 }" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'DataTable',
  props: {
    rows: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:selected', 'row-click', 'edit', 'delete'],
  setup(props, { emit }) {
    const localSelected = ref(props.selected);

    watch(localSelected, (newValue) => {
      emit('update:selected', newValue);
    });

    watch(() => props.selected, (newValue) => {
      localSelected.value = newValue;
    });

    return {
      localSelected
    };
  }
});
</script>

<style lang="scss" scoped>
.q-table {
  th {
    font-weight: 500;
  }

  tbody tr:hover {
    background: rgba(255, 107, 44, 0.1) !important;
  }

  .q-checkbox {
    .q-checkbox__inner {
      color: white;
    }

    .q-checkbox__bg {
      border-color: rgba(255, 255, 255, 0.7);
    }
  }
}

@media (max-width: 600px) {
  .q-table {

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      font-size: 12px;
    }

    thead tr th {
      padding: 5px 5px;
    }

    thead tr:first-child th {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .q-table__sort-icon {
      font-size: 16px;
    }

    tbody td {
      padding-top: 5px;
      padding-bottom: 5px;
      font-size: 12px;
    }
  }
}
</style>
