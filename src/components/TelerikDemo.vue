<template>
  <div class="toolbar p-2">
    <KButton
      :disabled="!selectedEmployee"
      :theme-color="'primary'"
      @click="editSelected"
    >
      Edit Selected
    </KButton>
  </div>

  <grid
    :data-items="selectableGridData"
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
    :sortable="true"
    :sort="sort"
    @sortchange="onSortChange"
    :selected-field="selectedField"
    @rowclick="onRowClick"
  />

  <KDialog v-if="employeeInEdit" @close="cancelEdit">
    <div class="k-form k-form-vertical" style="min-width: 300px">
      <div class="k-form-field"><label class="k-form-label">Name</label><KInput v-model="employeeInEdit.name" /></div>
      <div class="k-form-field"><label class="k-form-label">Email</label><KInput v-model="employeeInEdit.email" /></div>
      <div class="k-form-field"><label class="k-form-label">Salary</label><NumericTextBox v-model="employeeInEdit.salary" /></div>
      <div class="k-form-field"><label class="k-form-label">Department</label><KInput v-model="employeeInEdit.department" /></div>
      <div class="k-form-field"><label class="k-form-label">Location</label><KInput v-model="employeeInEdit.location" /></div>
      <div class="k-form-field"><label class="k-form-label">Telephone</label><KInput v-model="employeeInEdit.telephone" /></div>
      <div class="k-form-field"><label class="k-form-label">Availability</label><Checkbox v-model="employeeInEdit.availability" /></div>
      <div class="k-form-field">
        <label class="k-form-label">Assets (comma separated)</label>
        <KInput v-model="assetsInput" @input="onAssetsInput" />
      </div>
    </div>
    <DialogActionsBar>
      <KButton @click="saveEdit" :theme-color="'primary'">Save</KButton>
      <KButton @click="cancelEdit">Cancel</KButton>
      <KButton @click="deleteEdit" :theme-color="'error'">Delete</KButton>
    </DialogActionsBar>
  </KDialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { Grid, type GridColumnProps } from '@progress/kendo-vue-grid';
import { Dialog as KDialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Input as KInput, NumericTextBox, Checkbox } from '@progress/kendo-vue-inputs';
import { Button as KButton } from '@progress/kendo-vue-buttons';
import { process, type State, type GroupDescriptor, type DataResult } from '@progress/kendo-data-query';

interface Employee {
  id: number;
  name: string;
  email: string;
  recruitmentDate: Date | string;
  salary: number;
  department: string;
  availability: boolean;
  location: string;
  telephone: string;
  assets: string[];
}

export default defineComponent({
  name: 'KendoBasicGrid',
  components: {
    grid: Grid,
    KDialog,
    DialogActionsBar,
    KInput,
    NumericTextBox,
    KButton,
    Checkbox
  },
  setup() {
    const gridData = ref<Employee[]>([]);
    const gridView = ref<DataResult>({ data: [], total: 0 });
    const filter = ref<any>(null);
    const sort = ref<any[]>([]);
    const group = ref<GroupDescriptor[]>([]);
    const skip = ref(0);
    const take = ref(10);
    const pageable = ref({
      buttonCount: 5,
      pageSizes: [5, 10, 20, 50],
      info: true,
      type: 'numeric',
      previousNext: true
    });

    const selectedField = 'selected';
    const selectedID = ref<number | null>(null);
    const employeeInEdit = ref<Employee | null>(null);
    const assetsInput = ref('');

    const allColumns: GridColumnProps[] = [
      { field: 'id', title: 'ID', width: 50, resizable: false },
      { field: 'name', title: 'Name', width: 180 },
      { field: 'email', title: 'Email', width: 220 },
      { field: 'recruitmentDate', title: 'Date', width: 140, filter: 'date', format: '{0:yyyy-MM-dd}' },
      { field: 'salary', title: 'Salary', width: 120, filter: 'numeric', format: '{0:c}' },
      { field: 'department', title: 'Department', width: 150 },
      { field: 'location', title: 'Location', width: 150 },
      { field: 'telephone', title: 'Telephone', width: 180 },
      { field: 'availability', title: 'Available', width: 120, filter: 'boolean' },
      {
        field: 'assets',
        title: 'Assets',
        width: 200,
        cell: (h: any) => {
          const item = h?.props?.dataItem;
          return Array.isArray(item?.assets) ? item.assets.join(', ') : '';
        }
      }
    ];

    const columns = computed(() => {
      const groupedFields = group.value.map(g => g.field);
      return allColumns.filter(col => !('field' in col) || !groupedFields.includes(col.field!));
    });

    const getData = () => {
      gridView.value = process(gridData.value, {
        group: group.value,
        filter: filter.value,
        sort: sort.value,
        take: take.value,
        skip: skip.value
      });
    };

    const onDataStateChange = (e: { data: State }) => {
      group.value = e.data.group || [];
      skip.value = e.data.skip ?? 0;
      take.value = e.data.take ?? 10;
      filter.value = e.data.filter ?? null;
      sort.value = e.data.sort ?? [];
      getData();
    };

    const onExpandChange = (e: any) => {
      if (e.dataItem) {
        e.dataItem[e.target.$props.expandField] = e.value;
      }
    };

    const onFilterChange = (e: any) => {
      filter.value = e.filter;
      getData();
    };

    const onPageChange = (e: any) => {
      skip.value = e.page.skip;
      take.value = e.page.take;
      getData();
    };

    const onSortChange = (e: any) => {
      sort.value = e.sort;
      getData();
    };

    const selectableGridData = computed(() =>
      gridView.value.data.map((item: any) => ({
        ...item,
        selected: item.id === selectedID.value
      }))
    );

    const selectedEmployee = computed(() =>
      gridData.value.find(e => e.id === selectedID.value) || null
    );

    const onRowClick = (e: any) => {
      selectedID.value = e.dataItem.id;
    };

    const editSelected = () => {
      if (selectedEmployee.value) {
        employeeInEdit.value = { ...selectedEmployee.value };
        assetsInput.value = selectedEmployee.value.assets.join(', ');
      }
    };

    const onAssetsInput = (...args: any[]) => {
      const value = args[0]?.value ?? '';
      if (employeeInEdit.value) {
        employeeInEdit.value.assets = value.split(',').map((a: string) => a.trim());
      }
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

    const deleteEdit = () => {
      if (employeeInEdit.value) {
        const confirmed = confirm(`Are you sure to delete ${employeeInEdit.value.name}?`);
        if (confirmed) {
          gridData.value = gridData.value.filter(e => e.id !== employeeInEdit.value?.id);
          employeeInEdit.value = null;
          getData();
        }
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
      getData();
    });

    return {
      gridData,
      gridView,
      columns,
      pageable,
      filter,
      sort,
      group,
      take,
      skip,
      onDataStateChange,
      onExpandChange,
      onPageChange,
      onSortChange,
      onFilterChange,
      employeeInEdit,
      cancelEdit,
      saveEdit,
      deleteEdit,
      selectedID,
      selectedField,
      selectedEmployee,
      selectableGridData,
      onRowClick,
      editSelected,
      assetsInput,
      onAssetsInput
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
.toolbar {
  margin-bottom: 8px;
}
</style>
