<template>
  <div
    class="project-management q-pa-md"
    style="background: #2d2d3a; color: white"
  >
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white">
      {{ `Project(s) for ${customer.name}` }}
    </div>

    <!-- Search Header Component -->
    <SearchHeader
      v-model:searchTerm="searchTerm"
      item-name="Project"
      :hasSelected="selectedProjects.length > 0"
      @add="openAddProjectDialog"
      @delete-selected="confirmDeleteSelected"
    />

    <!-- Data Table Component -->
    <DataTable
      :rows="filteredProjects"
      :columns="columns"
      :loading="loading"
      v-model:selected="selectedProjects"
      @row-click="goToSites"
      @edit="openEditProjectDialog"
      @delete="confirmDeleteSingle"
    />

    <!-- Form Dialog Component -->
    <FormDialog
      v-model="projectDialog"
      :title="editingProject ? 'Edit Project' : 'Add Project'"
      :is-valid="!!projectForm.name"
      @save="saveProject"
      @cancel="projectDialog = false"
    >
      <q-input
        v-model="projectForm.name"
        label="Name"
        dark
        outlined
        :rules="[(val) => !!val || 'Name is required']"
      />
    </FormDialog>

    <!-- Confirmation Dialog Component -->
    <ConfirmationDialog
      v-model="deleteConfirmDialog"
      :message="deleteConfirmMessage"
      confirm-label="DELETE"
      @confirm="executeDelete"
      @cancel="deleteConfirmDialog = false"
    />
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { Customer } from "../../services/customerService";
import { Project } from "src/types/models";
import { projectService } from "../../services/projectService";
import SearchHeader from "../FormComponents/SearchHeader.vue";
import DataTable from "../FormComponents/DataTable.vue";
import FormDialog from "../FormComponents/FormDialog.vue";
import ConfirmationDialog from "../FormComponents/ConfirmationDialog.vue";

export default defineComponent({
  name: "ProjectList",
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
    const projectDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingProject = ref<Project | null>(null);
    const searchTerm = ref("");
    const selectedProjects = ref<Project[]>([]);
    const deleteConfirmMessage = ref("");
    const deleteMode = ref<"single" | "multiple">("single");
    const singleDeleteId = ref<number | null>(null);

    const projectForm = ref<Project>({} as Project);

    const columns = [
      { name: "id", label: "ID", field: "id", sortable: true },
      { name: "name", label: "Name", field: "name", sortable: true },
    ];

    const filteredProjects = computed(() => {
      return props.customer.projects?.filter((project: Project) =>
        project.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const openAddProjectDialog = () => {
      editingProject.value = null;
      projectForm.value = {
        name: "",
      } as Project;
      projectDialog.value = true;
    };

    const openEditProjectDialog = (project: Project) => {
      editingProject.value = project;
      projectForm.value = { ...project };
      projectDialog.value = true;
    };

    const saveProject = async () => {
      try {
        if (editingProject.value) {
          await projectService.updateProject(
            editingProject.value.id,
            projectForm.value
          );
        } else {
          await projectService.createProject({
            ...projectForm.value,
            customerId: props.customer.id,
          } as Project);
        }
        projectDialog.value = false;
        emit("project-updated");
      } catch (error) {
        console.error("Failed to save project:", error);
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = "single";
      singleDeleteId.value = id;
      deleteConfirmMessage.value =
        "Are you sure you want to delete this project?";
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = "multiple";
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedProjects.value.length} project(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === "single" && singleDeleteId.value !== null) {
        await deleteSingleProject(singleDeleteId.value);
      } else if (deleteMode.value === "multiple") {
        await deleteSelectedProjects();
      }
    };

    const deleteSingleProject = async (id: number) => {
      try {
        await projectService.deleteProject(id);
        emit("project-updated");
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    };

    const deleteSelectedProjects = async () => {
      try {
        for (const project of selectedProjects.value) {
          await projectService.deleteProject(project.id);
        }
        selectedProjects.value = [];
        emit("project-updated");
      } catch (error) {
        console.error("Failed to delete selected projects:", error);
      }
    };

    const goToSites = (projectId: number) => {
      if (selectedProjects.value.length === 0) {
        router.push({
          name: "SiteList",
          params: { projectId: projectId.toString() },
        });
      }
    };

    return {
      filteredProjects,
      columns,
      loading,
      projectDialog,
      deleteConfirmDialog,
      deleteConfirmMessage,
      projectForm,
      editingProject,
      searchTerm,
      selectedProjects,
      openAddProjectDialog,
      openEditProjectDialog,
      saveProject,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      goToSites,
    };
  },
});
</script>

<style lang="scss" scoped>
.project-management {
  .q-btn {
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .q-input {
    .q-field__control {
      background: rgba(255, 255, 255, 0.05);
    }

    .q-field__label {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 600px) {
    .q-btn {
      &.q-mr-sm {
        margin-top: 12px;
      }
    }
  }
}
</style>
