<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Grid } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'

export default defineComponent({
  name: 'GridJsDemo',
  setup() {
    const tableRef = ref<HTMLElement | null>(null)
    const gridInstance = ref<any>(null)

    const exportToCSV = () => {
      const headers = [
        'ID', 'Name', 'Department', 'Salary', 'Available',
        'Email', 'Location', 'Telephone', 'Assets'
      ]

      const csv = [
        headers.join(','),
        ...(gridInstance.value?.config?.data ?? []).map((row: any[]) =>
          row.map(val => `"${val}"`).join(',')
        )
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', 'employees.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    onMounted(async () => {
      const res = await fetch('http://localhost:3000/employees')
      const data = await res.json()

      const tableData = data.map((e: any) => [
        e.id,
        e.name,
        e.department,
        e.salary,
        e.availability ? 'Yes' : 'No',
        e.email,
        e.location,
        e.telephone,
        e.assets?.join(', ')
      ])

      const grid = new Grid({
        columns: [
          'ID', 'Name', 'Department', 'Salary', 'Available',
          'Email', 'Location', 'Telephone', 'Assets'
        ],
        data: tableData,
        search: true,
        sort: true,
        pagination: { limit: 10 },
      })

      if (tableRef.value) {
        grid.render(tableRef.value)
        gridInstance.value = grid
      }
    })

    return {
      tableRef,
      exportToCSV
    }
  }
})
</script>

<template>
  <div class="gridjs-wrapper">
    <button class="btn btn-dark mb-3" @click="exportToCSV">Export CSV</button>
    <div ref="tableRef"></div>
  </div>
</template>

<style scoped>
.gridjs-wrapper {
  padding: 2rem;
}
button {
  padding: 0.5rem 1rem;
  font-weight: bold;
}
</style>
