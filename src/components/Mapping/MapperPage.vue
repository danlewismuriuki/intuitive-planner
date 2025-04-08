<template>
  <q-layout>
    <q-header class="bg-transparent">
      <q-toolbar>
        <q-toolbar-title class="text-orange text-center "
          >Parent-Child Diagram</q-toolbar-title
        >
      </q-toolbar>
    </q-header>

    <q-page-container>
      <MapperExample />
    </q-page-container>
  </q-layout>
</template>

<script>
import MapperExample from "../Mapping/MapperExample.vue";

export default {
  name: "MapperPage",
  components: { MapperExample },
};
</script>
