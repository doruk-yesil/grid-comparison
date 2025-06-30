<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { GridApi, ColDef } from 'ag-grid-community'

export default defineComponent({
  name: 'AgGridDemo',
  components: {
    AgGridVue
  },
  setup() {
    const columnDefs = ref<ColDef[]>([
      { field: 'id', headerName: 'Employee ID', enableRowGroup: true },
      { field: 'name', headerName: 'Full Name', enableRowGroup: true },
      { field: 'email', headerName: 'E-mail', enableRowGroup: true },
      { field: 'recruitmentDate', headerName: 'Recruited On', enableRowGroup: true },
      { field: 'salary', headerName: 'Salary', enableRowGroup: true },
      { field: 'location', headerName: 'Location', enableRowGroup: true },
      { field: 'department', headerName: 'Department', enableRowGroup: true},
      { field: 'telephone', headerName: 'Telephone', enableRowGroup: true },
      { field: 'assets', headerName: 'Assets', enableRowGroup: true },
      { field: 'availability', headerName: 'Available', enableRowGroup: true }
    ])

    const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120
    }

    const rowData = ref([])
    const gridApi = ref<GridApi>()

    const onGridReady = (params: any) => {
      gridApi.value = params.api

      fetch('http://localhost:3000/employees')
        .then(res => res.json())
        .then(data => {
          rowData.value = data
        })
        .catch(err => console.error('Data fetch error:', err))
    }

    return {
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady
    }
  }
})
</script>

<template>
  <div class="ag-theme-alpine" style="height: 600px; width: 100%">
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 100%"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :pagination="true"
      :animateRows="true"
      :rowSelection="'multiple'"
      :rowGroupPanelShow="'always'"
      :sideBar="true"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<style scoped>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";
</style>
