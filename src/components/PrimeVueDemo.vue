<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'PrimeVueDemo',
  components: {
    DataTable,
    Column
  },
  setup() {
    const employees = ref([])
    const rows=ref(10)
    const setRows = (count: number) => {
      rows.value = count
    }
    onMounted(async () => {
      try {
        const res = await fetch('http://localhost:3000/employees')
        employees.value = await res.json()
      } catch (err) {
        console.error('Fetch error:', err)
      }
    })

    return {
      employees,
      setRows,
      rows
    }
  }
})
</script>

<template>
  <div class="prime-vue-demo">
    <DataTable
      :value="employees"
      paginator
      :rows="rows"
      responsiveLayout="scroll"
      stripedRows
      filterDisplay="row"
      showGridlines
      scrollHeight="400px"
      scrollable
      tableStyle="min-width: 1200px"
    >
      <Column field="id" class="p-3 h3" style="background-color: #f9f6d8;" header="Employee ID" sortable />
      <Column field="name" class="p-3 h3" style="background-color: #f9f6d8;" header="Full Name" sortable />
      <Column field="email" class="p-3 h3" style="background-color: #f9f6d8;" header="Email" sortable />
      <Column field="department" class="p-3 h3" style="background-color: #f9f6d8;" header="Department" sortable />
      <Column field="salary" class="p-3 h3" style="background-color: #f9f6d8;" header="Salary" sortable />
      <Column field="availability" class="p-3 h3" style="background-color: #f9f6d8;" header="Available" sortable/>
    </DataTable>
    <div class="text-center">
      <button @click="setRows(10)" class="btn btn-dark m-1">10</button>
      <button @click="setRows(20)" class="btn btn-dark m-1">20</button>
      <button @click="setRows(50)" class="btn btn-dark m-1">50</button>
      <button @click="setRows(100)" class="btn btn-dark m-1">100</button>
    </div>
  </div>
</template>

<style scoped>
.prime-vue-demo {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
</style>
