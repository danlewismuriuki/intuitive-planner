<template>
  <q-page padding>
    <div style="height: 100vh; width: 100%; border: 1px solid #ccc">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :zoom-on-scroll="true"
        :pan-on-drag="true"
        fit-view
        @node:click="onNodeClick"
        @edge:click="onEdgeClick"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { VueFlow } from "@vue-flow/core";

export default defineComponent({
  name: "MapperExample",
  components: { VueFlow },
  setup() {
    // Nodes (Zone and Racks)
    const nodes = ref([
      {
        id: "zone-1",
        label: "Zone 1",
        position: { x: 250, y: 50 },
        data: { label: "Zone 1" },
        style: { background: "#FFEE93" },
      },
      {
        id: "rack-1",
        label: "Rack 1",
        position: { x: 150, y: 200 },
        data: { label: "Rack 1" },
        style: { background: "#A1DFF7" },
      },
      {
        id: "rack-2",
        label: "Rack 2",
        position: { x: 250, y: 200 },
        data: { label: "Rack 2" },
        style: { background: "#A1DFF7" },
      },
      {
        id: "rack-3",
        label: "Rack 3",
        position: { x: 350, y: 200 },
        data: { label: "Rack 3" },
        style: { background: "#A1DFF7" },
      },
      {
        id: "rack-4",
        label: "Rack 4",
        position: { x: 450, y: 250 },
        data: { label: "Rack 4" },
        style: { background: "#A1DFF7" },
      },
    ]);

    // Edges (Connections between Zone and Racks)
    const edges = ref([
      {
        id: "zone-1-rack-1",
        source: "zone-1",
        target: "rack-1",
        style: { stroke: "#888" },
      },
      {
        id: "zone-1-rack-2",
        source: "zone-1",
        target: "rack-2",
        style: { stroke: "#888" },
      },
      {
        id: "zone-1-rack-3",
        source: "zone-1",
        target: "rack-3",
        style: { stroke: "#888" },
      },
      
      {
        id:  "zone-1-rack-4", // New node
        source: "zone-1",
        target: "rack-4",
        style: { stroke: "#888" }
        },
    ]);

    // Event Handlers
    const onNodeClick = (node) => console.log("Node clicked:", node);
    const onEdgeClick = (edge) => console.log("Edge clicked:", edge);

    return { nodes, edges, onNodeClick, onEdgeClick };
  },
});
</script>

<style>
/* Optional: Add custom styles for your nodes and edges */
</style>
