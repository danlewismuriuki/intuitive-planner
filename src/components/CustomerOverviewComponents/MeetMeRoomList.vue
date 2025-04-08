<template>
  <div
    class="meet-me-room-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      Meet Me Room(s) for {{ customerName }}
    </div>

    <!-- Search and Actions Row -->
    <SearchHeader
      v-model:searchTerm="searchTerm"
      item-name="Meet Me Room"
      :hasSelected="selectedRooms.length > 0"
      @add="openAddRoomDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Table Section -->
    <DataTable
      :rows="filteredRooms"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedRooms"
      @edit="openEditRoomDialog"
      @delete="confirmDeleteSingle"
    />

    <!-- Add/Edit Form Dialog -->
    <FormDialog
      v-model="roomDialog"
      :title="editingRoom ? 'Edit Meet Me Room' : 'Add Meet Me Room'"
      :is-valid="isFormValid"
      @save="saveRoom"
      @cancel="roomDialog = false"
    >
      <q-input
        v-model="roomForm.name"
        label="Name"
        dark
        outlined
        class="q-mb-md"
        :rules="[(val) => !!val || 'Name is required']"
      />
      <q-select
        v-model="roomForm.floorId"
        :options="floorOptions"
        label="Select Floor"
        option-value="id"
        option-label="name"
        map-options
        emit-value
        dark
        outlined
        class="q-mb-md"
        :rules="[(val) => !!val || 'Floor is required']"
      />
      <q-input
        v-model="roomForm.tilesWidth"
        type="number"
        label="Tiles Width"
        dark
        outlined
        class="q-mb-md"
        :rules="[(val) => !!val || 'Tiles Width is required']"
      />
      <q-input
        v-model="roomForm.tilesLength"
        type="number"
        label="Tiles Length"
        dark
        outlined
        class="q-mb-md"
        :rules="[(val) => !!val || 'Tiles Length is required']"
      />
    </FormDialog>

    <!-- Delete Confirmation Dialog -->
    <ConfirmationDialog
      v-model="deleteConfirmDialog"
      :message="deleteConfirmMessage"
      @confirm="executeDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { meetMeRoomService } from "src/services/meetMeRoomService";
import { customerService } from "../../services/customerService";
import { floorService } from "../../services/floorService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";
import { MeetMeRoom } from "src/types/models";

interface FloorOption {
  id: number;
  name: string;
}

export default defineComponent({
  name: "MeetMeRoomManagement",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const customerName = ref("");
    const rooms = ref<MeetMeRoom[]>([]);
    const loading = ref(false);
    const roomDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingRoom = ref<MeetMeRoom | null>(null);
    const searchTerm = ref("");
    const selectedRooms = ref<MeetMeRoom[]>([]);
    const deleteConfirmMessage = ref("");
    const deleteMode = ref<"single" | "multiple">("single");
    const singleDeleteId = ref<number | null>(null);
    const floorOptions = ref<FloorOption[]>([]);

    const roomForm = ref({
      name: "",
      floorId: null as number | null,
      tilesWidth: null as number | null,
      tilesLength: null as number | null,
    });

    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "name", label: "Name", field: "name", sortable: true },
      {
        name: "floorName",
        label: "Floor",
        field: "floorId",
        sortable: true,
      },
      {
        name: "tilesWidth",
        label: "Tiles Width",
        field: "tilesWidth",
        sortable: true,
      },
      {
        name: "tilesLength",
        label: "Tiles Length",
        field: "tilesLength",
        sortable: true,
      },
    ];

    const filteredRooms = computed(() =>
      rooms.value.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    );

    const isFormValid = computed(
      () =>
        !!roomForm.value.name &&
        !!roomForm.value.floorId &&
        !!roomForm.value.tilesWidth &&
        !!roomForm.value.tilesLength
    );

    const fetchRooms = async () => {
      loading.value = true;
      try {
        rooms.value = await meetMeRoomService.getRoomsByCustomerId(
          props.customerId
        );
      } catch (error) {
        console.error("Failed to fetch meet me rooms:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCustomerName = async () => {
      try {
        const customer = await customerService.getCustomerById(
          props.customerId
        );
        customerName.value = customer.name;
      } catch (error) {
        console.error("Failed to fetch customer name:", error);
      }
    };

    const fetchFloors = async () => {
      try {
        const floors = await floorService.getFloorsByCustomerId(
          props.customerId
        );
        floorOptions.value = floors.map((floor) => ({
          id: floor.id,
          name: floor.name,
        }));
      } catch (error) {
        console.error("Failed to fetch floors:", error);
      }
    };

    const openAddRoomDialog = () => {
      editingRoom.value = null;
      roomForm.value = {
        name: "",
        floorId: null,
        tilesWidth: null,
        tilesLength: null,
      };
      roomDialog.value = true;
    };

    const openEditRoomDialog = (room: MeetMeRoom) => {
      editingRoom.value = room;
      roomForm.value = {
        name: room.name,
        floorId: room.floorId,
        tilesWidth: room.tilesWidth,
        tilesLength: room.tilesLength,
      };
      roomDialog.value = true;
    };

    const saveRoom = async () => {
      try {
        const roomData = {
          ...roomForm.value,
          customerId: props.customerId,
          floorId: roomForm.value.floorId!,
          tilesWidth: roomForm.value.tilesWidth ?? 0,
          tilesLength: roomForm.value.tilesLength ?? 0,
        };

        if (editingRoom.value) {
          await meetMeRoomService.updateRoom(editingRoom.value.id, roomData);
        } else {
          await meetMeRoomService.createRoom(roomData);
        }

        await fetchRooms();
        roomDialog.value = false;
        emit("room-updated");
      } catch (error) {
        console.error("Failed to save meet me room:", error);
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = "single";
      singleDeleteId.value = id;
      deleteConfirmMessage.value =
        "Are you sure you want to delete this meet me room?";
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = "multiple";
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedRooms.value.length} meet me room(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === "single" && singleDeleteId.value !== null) {
        await deleteSingleRoom(singleDeleteId.value);
      } else if (deleteMode.value === "multiple") {
        await deleteSelectedRooms();
      }
    };

    const deleteSingleRoom = async (id: number) => {
      try {
        await meetMeRoomService.deleteRoom(id);
        await fetchRooms();
        emit("room-updated");
      } catch (error) {
        console.error("Failed to delete meet me room:", error);
      }
    };

    const deleteSelectedRooms = async () => {
      try {
        for (const room of selectedRooms.value) {
          await meetMeRoomService.deleteRoom(room.id);
        }
        await fetchRooms();
        selectedRooms.value = [];
        emit("room-updated");
      } catch (error) {
        console.error("Failed to delete selected meet me rooms:", error);
      }
    };

    onMounted(() => {
      fetchRooms();
      fetchCustomerName();
      fetchFloors();
    });

    watch(
      () => props.customerId,
      () => {
        fetchRooms();
        fetchCustomerName();
        fetchFloors();
      }
    );

    return {
      customerName,
      rooms,
      loading,
      roomDialog,
      deleteConfirmDialog,
      editingRoom,
      searchTerm,
      selectedRooms,
      deleteConfirmMessage,
      deleteMode,
      singleDeleteId,
      floorOptions,
      roomForm,
      columns,
      filteredRooms,
      isFormValid,
      openAddRoomDialog,
      openEditRoomDialog,
      saveRoom,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
    };
  },
});
</script>
