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
      { field: 'id', headerName: 'Employee ID', enableRowGroup: false },
      { field: 'name', headerName: 'Full Name', enableRowGroup: true },
      { field: 'email', headerName: 'E-mail', enableRowGroup: false },
      { field: 'recruitmentDate', headerName: 'Recruited On', enableRowGroup: true },
      { field: 'salary', headerName: 'Salary', enableRowGroup: true, enableValue: true, aggFunc: 'sum' },
      { field: 'location', headerName: 'Location', enableRowGroup: true },
      { field: 'department', headerName: 'Department', enableRowGroup: true},
      { field: 'telephone', headerName: 'Telephone', enableRowGroup: false },
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
    const statusBar = {
      statusPanels: [{ statusPanel: 'agAggregationComponent', align: 'right' }]
    }

    const onGridReady = (params: any) => {
      gridApi.value = params.api

      fetch('http://localhost:3000/employees')
        .then(res => res.json())
        .then(data => {
          rowData.value = data
        })
        .catch(err => console.error('Data fetch error:', err))
    }
    const onExportCSV = () => {
      gridApi.value?.exportDataAsCsv()
    }

    const onExportExcel = () => {
      gridApi.value?.exportDataAsExcel({
        fileName: 'employees.xlsx',
        sheetName: 'Employees'
      })
    }
    return {
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      statusBar,
      onExportCSV,
      onExportExcel
    }
  }
})
</script>

<template>
  <div class="toolbar text-end">
    <KButton @click="onExportCSV" theme-color="primary" class="btn btn-secondary m-1">Export CSV</KButton>
    <KButton @click="onExportExcel" theme-color="primary" class="btn btn-secondary m-1">Export Excel</KButton>
  </div>
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
      :status-bar="statusBar"
    />
  </div>
</template>

<style scoped>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-alpine.css";
</style>
