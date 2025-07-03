<template>
  <div class="col-lg-12 control-section">
    <div>
      <ejs-grid
        ref="grid"
        id="default-aggregate-grid"
        :dataSource="gridData"
        :allowPaging="true"
        :allowSorting="true"
        :allowFiltering="true"
        :allowGrouping="true"
        :sortSettings="initialSort"
        :filterSettings="filterSettings"
        :editSettings="editSettings"
        :groupSettings="groupOptions"
        :loadingIndicator="loadingIndicator"
        :pageSettings="pageSettings"
        :toolbar="toolbar"
        :autoFit='true'
        :allowResizing='true'
        :allowReordering='true'
        height=500
        :frozenColumns='columns'
        :allowPdfExport='true'
        :allowExcelExport='true'
        :toolbarClick="toolbarClick"
        :selectionSettings="selectionOptions"
        :rowDropSettings="srcDropOptions"
        :allowRowDragAndDrop="true"
        :pdfQueryCellInfo="pdfQueryCellInfo"
        :actionComplete="onActionComplete"
      >
        <e-columns>
          <e-column field="id" headerText="Employee ID" minWidth='100' width="120" textAlign="Right" :isPrimaryKey="true" :validationRules="idRules" :allowGrouping="false"/>
          <e-column field="name" headerText="Full Name" minWidth='100' width="200" textAlign="Left" :validationRules="nameRules" />
          <e-column field="email" headerText="E-mail" minWidth='100' width="120" textAlign="Center"/>
          <e-column field="recruitmentDate" headerText="Recruited On" minWidth='100' width="150" textAlign="Center" type="date" format="yMd"/>
          <e-column field="salary" headerText="Salary" minWidth='100' width="160" textAlign="Right" format="C2" editType="numericedit" :validationRules="salaryRules" />
          <e-column field="location" headerText="Location" minWidth='100' width="120" textAlign="Center"/>
          <e-column field="department" headerText="Department" minWidth='100' width="120" textAlign="Center"/>          
          <e-column field="telephone" headerText="Telephone" minWidth='100' width="120" textAlign="Center"/>
          <e-column field="assets" headerText="Assets" minWidth="100" width="200" textAlign="Center" :allowFiltering="false" :allowSorting="false" :allowGrouping="false"/>
          <e-column field="availability" headerText="Available" minWidth='100' width="120" textAlign="Center" type="boolean" />
        </e-columns>
        <e-aggregates>
          <e-aggregate>
            <e-columns>
              <e-column type="Sum" field="salary" format="C2" footerTemplate="Total: ${Sum}" />
              <e-column type="Avg" field="salary" format="C2" footerTemplate="AVG: ${Avg}" />
            </e-columns>
          </e-aggregate>
        </e-aggregates>
      </ejs-grid>
    </div><div>
      <ejs-grid
        ref="destGrid"
        id="default-aggregate-destGrid"
        :dataSource="destGridData"
        :allowPaging="true"
        :allowSorting="true"
        :allowFiltering="true"
        :sortSettings="initialSort"
        :filterSettings="filterSettings"
        :editSettings="editSettings"
        :loadingIndicator="loadingIndicator"
        :pageSettings="pageSettings"
        :toolbar="toolbar"
        :autoFit='true'
        :allowResizing='true'
        :allowReordering='true'
        height=500
        :frozenColumns='columns'
        :allowPdfExport='true'
        :allowExcelExport='true'
        :toolbarClick="toolbarClick"
        :selectionSettings="selectionOptions"
        :rowDropSettings="srcDropOptions"
        :allowRowDragAndDrop="true"
        :pdfQueryCellInfo="pdfQueryCellInfo"
      >
        <e-columns>
          <e-column field="id" headerText="Employee ID" minWidth='100' width="120" textAlign="Right" :isPrimaryKey="true" :validationRules="idRules" :allowGrouping="false"/>
          <e-column field="name" headerText="Full Name" minWidth='100' width="200" textAlign="Left" :validationRules="nameRules" :allowGrouping="false"/>
          <e-column field="email" headerText="E-mail" minWidth='100' width="120" textAlign="Center" :allowGrouping="false"/>
          <e-column field="recruitmentDate" headerText="Recruited On" minWidth='100' width="150" textAlign="Center" type="date" />
          <e-column field="salary" headerText="Salary" minWidth='100' width="160" textAlign="Right" editType="numericedit" :validationRules="salaryRules" />
          <e-column headerText='Workplace' :columns='workPlaceColumns' textAlign='Center'></e-column>
          <e-column field="telephone" headerText="Telephone" minWidth='100' width="120" textAlign="Center" :allowGrouping="false"/>
          <e-column field="assets" headerText="Assets" minWidth='100' width="200" textAlign="Center"/>
          <e-column field="availability" headerText="Available" minWidth='100' width="120" textAlign="Center" type="boolean" />
        </e-columns>
        <e-aggregates>
          <e-aggregate>
            <e-columns>
              <e-column type="Sum" field="salary" footerTemplate="Total: ${Sum}" />
            </e-columns>
          </e-aggregate>
        </e-aggregates>
      </ejs-grid>
    </div>
  </div>
</template>

<script lang="ts">
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Group,
  Sort,
  Toolbar,
  Edit,
  Filter,
  Page,
  Aggregate,
  AggregateDirective,
  AggregatesDirective,
  Resize,
  Reorder,
  Freeze,
  ExcelExport,
  PdfExport,
  RowDD,
  Selection,
} from "@syncfusion/ej2-vue-grids";
import type { ClickEventArgs } from '@syncfusion/ej2-vue-navigations';
import '@syncfusion/ej2-base/styles/bootstrap5.css';
import '@syncfusion/ej2-vue-grids/styles/bootstrap5.css';

export default {
  name: "SyncfusionGrid",
  components: {
    'ejs-grid': GridComponent,
    'e-column': ColumnDirective,
    'e-columns': ColumnsDirective,
    'e-aggregates': AggregatesDirective,
    'e-aggregate': AggregateDirective,
  },
  data() {
    return {
      columns: 1,
      gridData: [],
      destGridData: [],
      srcDropOptions: { targetID: "default-aggregate-destGrid" },
      destDropOptions: { targetID: "default-aggregate-grid" },
      initialSort: {},
      selectionOptions: { type: "Multiple" },
      filterSettings: { type: 'Excel' },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
      idRules: { required: true, number: true },
      nameRules: { required: true, minLength: 3 },
      salaryRules: { required: true, min: 0 },
      pageSettings: { pageCount: 3, pageSizes: [10, 25, 50, 100] },
      loadingIndicator: { indicatorType: 'Shimmer' },
      groupOptions: { columns: [] },
      toolbar: ['Add', 'Edit', 'Delete', 'Search', 'ExcelExport', 'PdfExport', 'CsvExport'],
      workPlaceColumns: [
                { field:"location", headerText:"Location", minWidth:'100', width:"120", textAlign:"Center"},
                { field:"department", headerText:"Department", minWidth:'100', width:"150", textAlign:"Left"}
            ],
    };
  },
  mounted() {
    fetch('http://localhost:3000/employees')
      .then(res => res.json())
      .then(json => {
        this.gridData = json
      });
  },
  methods:{
    onActionComplete(args: any) {
        if (args.requestType === 'grouping') {
            console.log('Gruplama işlemi tamamlandı, grid yenileniyor...'); // Konsola çıktı alarak kontrol edin
            const grid = this.$refs.grid as any;
            if (grid && grid.groupSettings.columns && grid.groupSettings.columns.length > 0) {
                grid.groupModule.groupColumn(grid.groupSettings.columns);
            } else {
                grid.refresh();
            }
        }
    },
    pdfQueryCellInfo(args: any) {
      if (args.cell.row && args.cell.row.pdfGrid) {
        args.cell.row.pdfGrid.repeatHeader = true;
      }
      if (args.column.field === 'salary' && args.data.salary < 50000) {
        args.style = {
          textBrushColor: '#FF0000'
        };
      }
    },
    toolbarClick(args: ClickEventArgs) {
      if (args.item.id === 'default-aggregate-grid_pdfexport') {
        const grid = this.$refs.grid as any;

        const columns = grid.getColumns().map((col: any) => ({
          field: col.field,
          headerText: col.headerText,
          width: 100
        }));

        const exportProperties = {
          pageOrientation: 'Landscape',
          fileName: 'employees.pdf',
          columns,
          fitColumnsToPage: true,
          exportType: 'AllPages',
          showHeader: true,
          footer: {
            fromBottom: 20,
            height: 50,
            contents: [
              {
                type: 'PageNumber',
                pageNumberType: 'Arabic',
                format: 'Page {$current} of {$total}',
                position: { x: 500, y: 30 },
                style: { textBrushColor: '#000000', fontSize: 10 }
              }
            ]
          }
        };

        grid.pdfExport(exportProperties);
      } else if (args.item.id === 'default-aggregate-grid_excelexport') {
        (this.$refs.grid as any).excelExport();
      } else if (args.item.id === 'default-aggregate-grid_csvexport') {
        (this.$refs.grid as any).csvExport();
      }
    }
  },
  provide: {
    grid: [Sort, Toolbar, Edit, Filter, Page, Group, Aggregate, Resize, Reorder, Freeze, ExcelExport, PdfExport, Selection, RowDD]
  }
};
</script>

<style scoped>
#default-aggregate-grid.e-grid tr.e-altrow .e-rowcell:not(.e-selectionbackground.e-active) {
  background-color: rgb(228 228 228 / 15%);
}
@import "../../styles/Grid/virtual-scrolling.css";
</style>