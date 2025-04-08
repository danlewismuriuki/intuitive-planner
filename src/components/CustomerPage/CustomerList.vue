<template>
  <div class="customer-management q-pa-md" style="background: #2D2D3A; min-height: 100vh; color: white;">
    <!-- Header Section -->
    <div class="text-h4 q-mb-lg text-weight-light" style="color: white;">
      Customer Management
    </div>

    <!-- Search and Actions Row -->
    <div class="row q-mb-md items-center">
      <q-input v-model="searchTerm" label="Search customers" class="col-grow q-mr-md" dark outlined
        bg-color="rgba(255,255,255,0.05)" style="border-radius: 8px;">
        <template v-slot:append>
          <q-icon name="search" color="grey" />
        </template>
      </q-input>

      <q-btn color="orange" label="Add Customer" @click="openAddCustomerDialog" class="q-mr-sm"
        style="background: #FF6B2C; border-radius: 8px;" />

      <q-btn v-if="selectedCustomers.length > 0" color="grey-7" label="Delete Selected" @click="confirmDeleteSelected"
        style="border-radius: 8px;" />
    </div>

    <!-- Table Section -->
    <q-table title="Customers" :rows="filteredCustomers" :columns="columns" row-key="id" :loading="loading"
      selection="multiple" v-model:selected="selectedCustomers" :pagination="{ rowsPerPage: 10 }" dark
      style="background: rgba(255,255,255,0.05); border-radius: 12px;" :table-style="{ color: 'white' }"
      :separator="'cell'">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            <q-checkbox v-model="props.selected" dark color="orange" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props" style="color: orange; font-weight: 500;">
            {{ col.label }}
          </q-th>
          <q-th auto-width style="color: orange;">
            Actions
          </q-th>
        </q-tr>
      </template>


      <template v-slot:body="props">
        <q-tr :props="props" :class="{ 'cursor-pointer': true, 'hover-row': true }">
          <q-td auto-width>
            <q-checkbox v-model="props.selected" dark color="orange" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props" @click="goToOverView(props.row.id)"
            style="color: #E0E0E0;">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn flat round color="orange" icon="edit" @click.stop="openEditCustomerDialog(props.row)"
              :disable="selectedCustomers.length > 0" :style="{ opacity: selectedCustomers.length > 0 ? 0.5 : 1 }" />
            <q-btn flat round color="grey" icon="delete" @click.stop="confirmDeleteSingle(props.row.id)"
              :disable="selectedCustomers.length > 0" :style="{ opacity: selectedCustomers.length > 0 ? 0.5 : 1 }" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="customerDialog" persistent dark>
      <q-card style="background: #2D2D3A; min-width: 400px; border-radius: 12px;">
        <q-card-section class="bg-orange-8" style="border-radius: 12px 12px 0 0;">
          <div class="text-h6 text-white">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-input v-model="customerForm.name" label="Name" dark outlined class="q-mb-md"
            :rules="[val => !!val || 'Name is required']" />
          <q-input v-model="customerForm.continent" label="Continent" dark outlined class="q-mb-md" />
          <q-input v-model="customerForm.country" label="Country" dark outlined class="q-mb-md" />
          <q-input v-model="customerForm.state" label="State" dark outlined class="q-mb-md" />
          <q-input v-model="customerForm.city" label="City" dark outlined />
        </q-card-section>

        <q-card-actions align="right" class="bg-light q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Save" color="orange" @click="saveCustomer" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteConfirmDialog" persistent dark>
      <q-card style="background: #2D2D3A; border-radius: 12px;">
        <q-card-section class="row items-center q-pa-lg">
          <q-icon name="warning" color="orange" size="2em" class="q-mr-md" />
          <span class="text-white">{{ deleteConfirmMessage }}</span>
        </q-card-section>

        <q-card-actions align="right" class="bg-light q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="DELETE" color="orange" @click="executeDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>



<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { customerService, Customer } from '../../services/customerService';

export default defineComponent({
  name: 'CustomerList',
  setup() {
    const router = useRouter();
    const customers = ref<Customer[]>([]);
    const loading = ref(false);
    const customerDialog = ref(false);
    const deleteConfirmDialog = ref(false);
    const editingCustomer = ref<Customer | null>(null);
    const searchTerm = ref('');
    const selectedCustomers = ref<Customer[]>([]);
    const deleteConfirmMessage = ref('');
    const deleteMode = ref<'single' | 'multiple'>('single');
    const singleDeleteId = ref<number | null>(null);

    const customerForm = ref({
      name: '',
      continent: '' as string | null,
      country: '' as string | null,
      state: '' as string | null,
      city: '' as string | null,
    });

    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'name', label: 'Name', field: 'name', sortable: true },
      { name: 'continent', label: 'Continent', field: 'continent', sortable: true },
      { name: 'country', label: 'Country', field: 'country', sortable: true },
      { name: 'state', label: 'State', field: 'state', sortable: true },
      { name: 'city', label: 'City', field: 'city', sortable: true },
    ];

    const filteredCustomers = computed(() => {
      return customers.value.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (customer.continent && customer.continent.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
        (customer.country && customer.country.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
        (customer.state && customer.state.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
        (customer.city && customer.city.toLowerCase().includes(searchTerm.value.toLowerCase()))
      );
    });

    const fetchCustomers = async () => {
      loading.value = true;
      try {
        customers.value = await customerService.getAllCustomers();
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        loading.value = false;
      }
    };

    const openAddCustomerDialog = () => {
      editingCustomer.value = null;
      customerForm.value = {
        name: '',
        continent: null,
        country: null,
        state: null,
        city: null,
      };
      customerDialog.value = true;
    };

    const openEditCustomerDialog = (customer: Customer) => {
      editingCustomer.value = customer;
      customerForm.value = { ...customer };
      customerDialog.value = true;
    };

    const saveCustomer = async () => {
      try {
        if (editingCustomer.value) {
          await customerService.updateCustomer(editingCustomer.value.id, customerForm.value);
        } else {
          await customerService.createCustomer(customerForm.value);
        }
        await fetchCustomers();
        customerDialog.value = false;
      } catch (error) {
        console.error('Failed to save customer:', error);
      }
    };

    const confirmDeleteSingle = (id: number) => {
      deleteMode.value = 'single';
      singleDeleteId.value = id;
      deleteConfirmMessage.value = 'Are you sure you want to delete this customer?';
      deleteConfirmDialog.value = true;
    };

    const confirmDeleteSelected = () => {
      deleteMode.value = 'multiple';
      deleteConfirmMessage.value = `Are you sure you want to delete ${selectedCustomers.value.length} record(s)?`;
      deleteConfirmDialog.value = true;
    };

    const executeDelete = async () => {
      if (deleteMode.value === 'single' && singleDeleteId.value !== null) {
        await deleteSingleCustomer(singleDeleteId.value);
      } else if (deleteMode.value === 'multiple') {
        await deleteSelectedCustomers();
      }
    };

    const deleteSingleCustomer = async (id: number) => {
      try {
        await customerService.deleteCustomer(id);
        await fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    };

    const deleteSelectedCustomers = async () => {
      try {
        for (const customer of selectedCustomers.value) {
          await customerService.deleteCustomer(customer.id);
        }
        await fetchCustomers();
        selectedCustomers.value = [];
      } catch (error) {
        console.error('Failed to delete selected customers:', error);
      }
    };

    const goToOverView = (customerId: number) => {
      if (selectedCustomers.value.length === 0) {
        router.push({ name: 'CustomerOverview', params: { customerId: customerId.toString() } });
      }
    };


    onMounted(fetchCustomers);

    return {
      columns,
      loading,
      searchTerm,
      customerDialog,
      deleteConfirmDialog,
      editingCustomer,
      customerForm,
      customers,
      filteredCustomers,
      selectedCustomers,
      deleteConfirmMessage,
      saveCustomer,
      openAddCustomerDialog,
      openEditCustomerDialog,
      confirmDeleteSingle,
      confirmDeleteSelected,
      executeDelete,
      goToOverView,
    };
  },
});
</script>

<style lang="scss" scoped>
.customer-management {
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

    .q-btn {
      &.q-mr-sm {
        margin-top: 12px;
      }
    }
  }
}
</style>
