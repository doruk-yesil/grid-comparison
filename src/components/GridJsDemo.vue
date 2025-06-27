<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { Grid } from 'gridjs'
import 'gridjs/dist/theme/mermaid.css'

export default defineComponent({
  name: 'GridJsDemo',
  setup() {
    const tableRef = ref<HTMLElement | null>(null)
    const gridInstance = ref<any>(null)
    const pageSize = ref(10)

    const renderTable = async () => {
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

      // 🧼 Önce mevcut tablo varsa destroy et
      if (gridInstance.value) {
        gridInstance.value.destroy()
        gridInstance.value = null
      }

      if (tableRef.value) {
        tableRef.value.innerHTML = ''

        const grid = new Grid({
          columns: [
            { name: 'ID', width: '80px' },
            { name: 'Name', width: '160px' },
            { name: 'Department', width: '140px' },
            { name: 'Salary', width: '100px' },
            { name: 'Available', width: '100px' },
            { name: 'Email', width: '220px' },
            { name: 'Location', width: '140px' },
            { name: 'Telephone', width: '140px' },
            { name: 'Assets', width: '220px' },
          ],
          data: tableData,
          search: true,
          sort: true,
          pagination: { limit: pageSize.value },
        })

        grid.render(tableRef.value)
        gridInstance.value = grid
      }
    }

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

    onMounted(renderTable)
    watch(pageSize, renderTable)

    return {
      tableRef,
      exportToCSV,
      pageSize
    }
  }
})
</script>

<template>
  <div class="gridjs-wrapper">
    <div class="d-flex align-items-center mb-3 gap-3">
      <label class="fw-bold">Rows per page:</label>
      <select v-model="pageSize" class="form-select" style="width: auto;">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>

      <button class="btn btn-dark ms-auto" @click="exportToCSV">
        Export CSV
      </button>
    </div>
    <div ref="tableRef"></div>
  </div>
</template>

<style scoped>
.gridjs-wrapper {
  padding: 2rem;
}
select.form-select {
  padding: 0.4rem;
  font-size: 0.9rem;
}
button {
  padding: 0.5rem 1rem;
  font-weight: bold;
}
</style>
