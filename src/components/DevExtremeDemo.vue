<template>
    <DxDataGrid
    :data-source="employees"
    :show-borders="true"
    key-expr="id"
    column-auto-width
    :word-wrap-enabled="true"
    height="600"
    :allow-column-reordering="true"
    @exporting="onExporting"
    >
    <DxEditing
    mode="row"
    :allow-updating="true"
    :allow-adding="true"
    :allow-deleting="true"
    />

    <DxSearchPanel :visible="true" :highlight-case-sensitive="false" />
    <DxColumnFixing :enabled="true" />
    <DxGroupPanel :visible="true" />
    <DxGrouping :auto-expand-all="false" />
    <DxFilterRow :visible="true" />
    <DxHeaderFilter :visible="true" />
    <DxPaging :enabled="true" :page-size="10" />
    <DxPager
        :show-page-size-selector="true"
        :allowed-page-sizes="[5, 10, 20]"
        :show-info="true"
    />
    <DxExport :enabled="true" />
    <DxColumnChooser :enabled="true" />
    <DxColumn data-field="id" caption="ID" :allow-hiding="false" />
    <DxColumn data-field="name" caption="Name" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="recruitmentDate" caption="Date" data-type="date" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="salary" caption="Salary" format="currency" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="department" caption="Department" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="availability" caption="Available" data-type="boolean" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="email" caption="Email" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="location" caption="Location" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn data-field="telephone" caption="Phone" :allow-sorting="true" :allow-filtering="true" :allow-hiding="true" />
    <DxColumn
        data-field="assets"
        caption="Assets"
        :cell-render="renderAssets"
        :allow-hiding="true"
    />
    </DxDataGrid>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {
  DxDataGrid,
  DxColumn,
  DxGroupPanel,
  DxGrouping,
  DxFilterRow,
  DxHeaderFilter,
  DxPaging,
  DxPager,
  DxExport,
  DxColumnChooser,
  DxSearchPanel,
  DxColumnFixing,
  DxEditing
} from 'devextreme-vue/data-grid';

import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

interface Employee {
  id: number;
  name: string;
  recruitmentDate: string;
  salary: number;
  department: string;
  availability: boolean;
  email: string;
  location: string;
  telephone: string;
  assets: string[];
}

const employees = ref<Employee[]>([]);

onMounted(async () => {
  const response = await axios.get<Employee[]>('http://localhost:3000/employees');
  employees.value = response.data;
});

function renderAssets(cellData: any) {
  return cellData.value?.join(', ') || '-';
}

async function onExporting(e: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Employees');

  const columns = e.component.getVisibleColumns();
  worksheet.columns = columns.map((col: any) => ({
    header: col.caption,
    key: col.dataField,
    width: 20
  }));

  employees.value.forEach((employee) => {
    worksheet.addRow({
      ...employee,
      assets: employee.assets?.join(', ')
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'employees.xlsx');
}

</script>

<style>
@import 'devextreme/dist/css/dx.light.css';
</style>
