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
  ></grid>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { Grid, type GridColumnProps } from '@progress/kendo-vue-grid';
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
    'grid': Grid
  },
  setup() {
    const gridData = ref<Employee[]>([]);
    const filter = ref<any>(null);

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
      { field: 'department', title: 'Department', width: 150 }
    ];

    const pageable = ref(true);

    const onFilterChange = (e: any) => {
      filter.value = e.filter;
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
      onFilterChange
    };
  }
});
</script>

<style scoped>
.k-grid {
  border-radius: 6px;
}
</style>
