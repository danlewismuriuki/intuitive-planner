<template>
  <div
    class="site-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      {{ `Site(s) for ${customer.name}` }}
    </div>

    <!-- Search Header -->
    <SearchHeader
      item-name="Site"
      v-model:searchTerm="searchTerm"
      :hasSelected="selectedSites.length > 0"
      @add="openAddSiteDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table -->
    <DataTable
      :rows="filteredSites"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedSites"
      @row-click="goToBuildings"
      @edit="openEditSiteDialog"
      @delete="confirmDeleteSingle"
    />

    <!-- Add/Edit Form Dialog -->
    <FormDialog
      v-model="siteDialog"
      :title="editingSite ? 'Edit Site' : 'Add Site'"
      :is-valid="isFormValid"
      @save="saveSite"
      @cancel="siteDialog = false"
    >
      <q-input
        v-model="siteForm.name"
        label="Name"
        dark
        outlined
        class="q-mb-md"
        :rules="[(val) => !!val || 'Name is required']"
      />
      <q-select
        v-model="siteForm.projectId"
        :options="projectOptions"
        label="Project"
        dark
        outlined
        option-value="id"
        option-label="name"
        emit-value
        map-options
        :rules="[(val) => !!val || 'Project is required']"
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
import { PropType, computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { Customer } from "../../services/customerService";
import { Project } from "src/types/models";
import { Site } from "src/types/models";
import { siteService } from "../../services/siteService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "SiteList",
  components: {
    SearchHeader,
    DataTable,
    FormDialog,
    ConfirmationDialog,
  },
  props: {
    customer: {
      type: Object as PropType<Customer>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const loading = ref(false);
    const siteDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingSite = ref<Site | null>(null);
    const searchTerm = ref("");
    const selectedSites = ref<Site[]>([]);
    const deleteConfirmMessage = ref("");
    const deleteMode = ref<"single" | "multiple">("single");
    const singleDeleteId = ref<number | null>(null);

    const siteForm = ref<Site>({} as Site);

    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "name", label: "Name", field: "name", sortable: true },
      {
        name: "project",
        label: "Project",
        field: (row: Site) => {
          const project = props.customer.projects.find(
            (p) => p.id === row.projectId
          );
          return project ? project.name : "N/A";
        },
        sortable: true,
      },
    ];

    const projectOptions = computed(() => {
      return props.customer.projects.map((project: Project) => ({
        label: project.name,
        value: project.id,
        id: project.id,
        name: project.name,
      }));
    });

    const filteredSites = computed(() => {
      return props.customer.sites?.filter((site: Site) =>
        site.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const isFormValid = computed(() => {
      return !!siteForm.value.name && !!siteForm.value.projectId;
    });

    const openAddSiteDialog = () => {
      editingSite.value = null;
      siteForm.value = {} as Site;
      siteDialog.value = true;
    };

    const openEditSiteDialog = (site: Site) => {
      editingSite.value = site;
      siteForm.value = {
        id: site.id,
        name: site.name,
        projectId: site.projectId,
        customerId: site.customerId,
      } as Site;
      siteDialog.value = true;
    };

    const saveSite = async () => {
      try {
        if (editingSite.value) {
          await siteService.updateSite(editingSite.value.id, {
            name: siteForm.value.name,
            projectId: siteForm.value.projectId,
          });
        } else {
          await siteService.createSite({
            name: siteForm.value.name,
            customerId: props.customer.id,
            projectId: siteForm.value.projectId,
          } as Site);
        }
        siteDialog.value = false;
        emit("site-updated");
      } catch (error) {
        console.error("Failed to save site:", error);
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = "single";
      singleDeleteId.value = id;
      deleteConfirmMessage.value = "Are you sure you want to delete this site?";
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = "multiple";
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedSites.value.length} site(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === "single" && singleDeleteId.value !== null) {
        await deleteSingleSite(singleDeleteId.value);
      } else if (deleteMode.value === "multiple") {
        await deleteSelectedSites();
      }
    };

    const deleteSingleSite = async (id: number) => {
      try {
        await siteService.deleteSite(id);
        emit("site-updated");
      } catch (error) {
        console.error("Failed to delete site:", error);
      }
    };

    const deleteSelectedSites = async () => {
      try {
        for (const site of selectedSites.value) {
          await siteService.deleteSite(site.id);
        }
        selectedSites.value = [];
        emit("site-updated");
      } catch (error) {
        console.error("Failed to delete selected sites:", error);
      }
    };

    const goToBuildings = (siteId: number) => {
      if (selectedSites.value.length === 0) {
        router.push({
          name: "BuildingList",
          params: { siteId: siteId.toString() },
        });
      }
    };

    return {
      filteredSites,
      columns,
      loading,
      siteDialog,
      deleteConfirmDialog,
      deleteConfirmMessage,
      siteForm,
      editingSite,
      searchTerm,
      selectedSites,
      projectOptions,
      isFormValid,
      openAddSiteDialog,
      openEditSiteDialog,
      saveSite,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      goToBuildings,
    };
  },
});
</script>

<style lang="scss" scoped>
.site-management {
  .q-input {
    .q-field__control {
      background: rgba(255, 255, 255, 0.05);
    }

    .q-field__label {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
