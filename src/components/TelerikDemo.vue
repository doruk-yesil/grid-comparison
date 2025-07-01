<template>
  <grid
    :data-items="filteredData"
    :columns="columns"
    :pageable="pageable"
    :style="{ height: '600px' }"
    :column-menu="true"
    :filter="filter"
    @filterchange="onFilterChange"
    :groupable="true"
    :reorderable="true"
  >
    <template #actionsTemplate="{ props }">
      <td class="k-command-cell">
        <button class="k-button k-button-md k-button-solid k-button-solid-primary" @click="editItem(props.dataItem)">Edit</button>
        <button class="k-button k-button-md k-button-solid k-button-solid-base" @click="removeItem(props.dataItem)">Remove</button>
      </td>
    </template>
  </grid>

  <KDialog v-if="employeeInEdit" @close="cancelEdit">
    <div class="k-form k-form-vertical" style="min-width: 300px">
      <div class="k-form-field">
        <label class="k-form-label">Name</label>
        <KInput v-model="employeeInEdit.name" />
      </div>
      <div class="k-form-field">
        <label class="k-form-label">Email</label>
        <KInput v-model="employeeInEdit.email" />
      </div>
      <div class="k-form-field">
        <label class="k-form-label">Salary</label>
        <NumericTextBox v-model="employeeInEdit.salary" />
      </div>
      <div class="k-form-field">
        <label class="k-form-label">Department</label>
        <KInput v-model="employeeInEdit.department" />
      </div>
    </div>
    <DialogActionsBar>
      <KButton @click="saveEdit" :theme-color="'primary'">Save</KButton>
      <KButton @click="cancelEdit">Cancel</KButton>
    </DialogActionsBar>
  </KDialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { Grid, type GridColumnProps } from '@progress/kendo-vue-grid';
import { Dialog as KDialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Input as KInput, NumericTextBox } from '@progress/kendo-vue-inputs';
import { Button as KButton } from '@progress/kendo-vue-buttons';
import { filterBy } from '@progress/kendo-data-query';

interface Employee {
  id: number;
  name: string;
  email: string;
  recruitmentDate: Date | string;
  salary: number;
  location: string;
  department: string;
}

export default defineComponent({
  name: 'KendoBasicGrid',
  components: {
    grid: Grid,
    KDialog,
    DialogActionsBar,
    KInput,
    NumericTextBox,
    KButton
  },
  setup() {
    const gridData = ref<Employee[]>([]);
    const filter = ref<any>(null);
    const employeeInEdit = ref<Employee | null>(null);

    const filteredData = computed(() =>
      filter.value ? filterBy(gridData.value, filter.value) : gridData.value
    );

    const columns: GridColumnProps[] = [
      { field: 'id', title: 'ID', width: 90 },
      { field: 'name', title: 'Name', width: 180 },
      { field: 'email', title: 'E-mail', width: 220 },
      { field: 'recruitmentDate', title: 'Date', width: 140, filter: 'date', format: '{0:yyyy-MM-dd}' },
      { field: 'salary', title: 'Salary', width: 120, filter: 'numeric', format: '{0:c}' },
      { field: 'location', title: 'Location', width: 150 },
      { field: 'department', title: 'Department', width: 150 },
      { title: 'Actions', width: 200, cell: 'actionsTemplate' }
    ];

    const pageable = ref(true);

    const onFilterChange = (e: any) => {
      filter.value = e.filter;
    };

    const editItem = (item: Employee) => {
      employeeInEdit.value = { ...item };
    };

    const cancelEdit = () => {
      employeeInEdit.value = null;
    };

    const saveEdit = () => {
      const index = gridData.value.findIndex(emp => emp.id === employeeInEdit.value?.id);
      if (index !== -1 && employeeInEdit.value) {
        gridData.value.splice(index, 1, { ...employeeInEdit.value });
      }
      employeeInEdit.value = null;
    };

    const removeItem = (item: Employee) => {
      const confirmed = confirm(`Are you sure to delete ${item.name}?`);
      if (confirmed) {
        gridData.value = gridData.value.filter(e => e.id !== item.id);
      }
    };

    onMounted(async () => {
      const res = await fetch('http://localhost:3000/employees');
      const data = await res.json();
      gridData.value = data.map((e: any) => ({
        ...e,
        recruitmentDate: new Date(e.recruitmentDate),
        salary: Number(e.salary) || 0
      }));
    });

    return {
      gridData,
      filteredData,
      columns,
      pageable,
      filter,
      onFilterChange,
      editItem,
      removeItem,
      employeeInEdit,
      cancelEdit,
      saveEdit
    };
  }
});
</script>

<style scoped>
.k-grid {
  border-radius: 6px;
}
.k-form-field {
  margin-bottom: 12px;
}
.k-command-cell button {
  margin-right: 6px;
}
</style>
