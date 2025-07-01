<template>
  <grid
    :data-items="gridView.data"
    :columns="columns"
    :pageable="pageable"
    :total="gridView.total"
    :skip="skip"
    :take="take"
    :style="{ height: '600px' }"
    :column-menu="true"
    :filter="filter"
    @filterchange="onFilterChange"
    :groupable="true"
    :group="group"
    :expand-field="'expanded'"
    @datastatechange="onDataStateChange"
    @expandchange="onExpandChange"
    @pagechange="onPageChange"
    :reorderable="true"
    :resizable="true"
  >
    <template #actionsTemplate="{ props }">
      <td v-if="props.rowType === 'data'" class="k-command-cell">
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { Grid, type GridColumnProps } from '@progress/kendo-vue-grid';
import { Dialog as KDialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Input as KInput, NumericTextBox } from '@progress/kendo-vue-inputs';
import { Button as KButton } from '@progress/kendo-vue-buttons';
import { process, type State, type GroupDescriptor, type DataResult } from '@progress/kendo-data-query';

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
    const pageable = ref({
      buttonCount: 5,
      pageSizes: [5, 10, 20, 50],
      info: true,
      type: 'numeric',
      previousNext: true
    });
    const skip = ref(0);
    const take = ref(10);
    const group = ref<GroupDescriptor[]>([{ field: 'department' }]);

    const gridView = ref<DataResult>({ data: [], total: 0 });

    const getData = () => {
      gridView.value = process(gridData.value, {
        group: group.value,
        filter: filter.value,
        take: take.value,
        skip: skip.value
      });
    };

    const onDataStateChange = (e: { data: State }) => {
      group.value = e.data.group || [];
      skip.value = e.data.skip ?? 0;
      take.value = e.data.take ?? 10;
      filter.value = e.data.filter ?? null;
      getData();
    };

    const onExpandChange = (e: any) => {
      if (e.dataItem) {
        e.dataItem[e.target.$props.expandField] = e.value;
      }
    };

    const allColumns: GridColumnProps[] = [
      { field: 'id', title: 'ID', width: 50, resizable: false },
      { field: 'name', title: 'Name', width: 180, minResizableWidth: 100 },
      { field: 'email', title: 'E-mail', width: 220, minResizableWidth: 150 },
      { field: 'recruitmentDate', title: 'Date', width: 140, minResizableWidth: 100, filter: 'date', format: '{0:yyyy-MM-dd}' },
      { field: 'salary', title: 'Salary', width: 120, minResizableWidth: 80, filter: 'numeric', format: '{0:c}' },
      { field: 'location', title: 'Location', width: 150, minResizableWidth: 100 },
      { field: 'department', title: 'Department', width: 150, minResizableWidth: 100 },
      { title: 'Actions', width: 100, resizable: false, cell: 'actionsTemplate' }
    ];

    const columns = computed(() => {
      const groupedFields = group.value.map(g => g.field);
      return allColumns.filter(col => !('field' in col) || !groupedFields.includes(col.field!));
    });


    const onFilterChange = (e: any) => {
      filter.value = e.filter;
      getData();
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
      getData();
    };

    const removeItem = (item: Employee) => {
      const confirmed = confirm(`Are you sure to delete ${item.name}?`);
      if (confirmed) {
        gridData.value = gridData.value.filter(e => e.id !== item.id);
        getData();
      }
    };

    const onPageChange = (e: any) => {
      skip.value = e.page.skip;
      take.value = e.page.take;
      getData();
    };


    onMounted(async () => {
      const res = await fetch('http://localhost:3000/employees');
      const data = await res.json();
      gridData.value = data.map((e: any) => ({
        ...e,
        recruitmentDate: new Date(e.recruitmentDate),
        salary: Number(e.salary) || 0
      }));
      getData();
    });

    return {
      gridData,
      gridView,
      columns,
      pageable,
      filter,
      onFilterChange,
      editItem,
      removeItem,
      employeeInEdit,
      cancelEdit,
      saveEdit,
      group,
      take,
      skip,
      onDataStateChange,
      onExpandChange,
      onPageChange
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
