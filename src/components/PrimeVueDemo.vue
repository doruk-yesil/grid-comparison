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

    onMounted(async () => {
      try {
        const res = await fetch('http://localhost:3000/employees')
        employees.value = await res.json()
      } catch (err) {
        console.error('Fetch error:', err)
      }
    })

    return {
      employees
    }
  }
})
</script>

<template>
  <div class="prime-vue-demo">
    <DataTable
      :value="employees"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      stripedRows
      filterDisplay="row"
      showGridlines
      tableStyle="min-width: 1200px"
    >
      <Column field="id" header="Employee ID" sortable />
      <Column field="name" header="Full Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="department" header="Department" sortable />
      <Column field="salary" header="Salary" sortable />
      <Column field="availability" header="Available" sortable/>
    </DataTable>
  </div>
</template>

<style scoped>
.prime-vue-demo {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
</style>
