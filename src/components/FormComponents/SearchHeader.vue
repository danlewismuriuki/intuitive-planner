<template>
  <div class="row q-mb-md items-center">
    <q-input v-model="localSearchTerm" :label="`Search ${itemName}`" class="col-grow q-mr-md" dark outlined
      bg-color="rgba(255,255,255,0.05)" style="border-radius: 8px">
      <template v-slot:append>
        <q-icon name="search" color="grey" />
      </template>
    </q-input>

    <q-btn color="orange" :label="`Add ${itemName}`" @click="$emit('add')" class="q-mr-sm"
      style="background: #ff6b2c; border-radius: 8px" />

    <q-btn v-if="hasSelected" color="grey-7" label="Delete Selected" @click="$emit('delete-selected')"
      style="border-radius: 8px" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'SearchHeader',
  props: {
    itemName: {
      type: String,
      required: true
    },
    searchTerm: {
      type: String,
      required: true
    },
    hasSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:searchTerm', 'add', 'delete-selected'],
  setup(props, { emit }) {
    const localSearchTerm = ref(props.searchTerm);

    watch(localSearchTerm, (newValue) => {
      emit('update:searchTerm', newValue);
    });

    watch(() => props.searchTerm, (newValue) => {
      localSearchTerm.value = newValue;
    });

    return {
      localSearchTerm
    };
  }
});
</script>
