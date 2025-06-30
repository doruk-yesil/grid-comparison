<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QTable } from 'quasar'


const rows = ref([])
const loading = ref(true)

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'department', label: 'Department', field: 'department', sortable: true },
  { name: 'salary', label: 'Salary', field: 'salary', sortable: true },
  { name: 'availability', label: 'Available', field: 'availability', sortable: true }
]

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

onMounted(async () => {
    await import('quasar/dist/quasar.css')
    try {
        const res = await fetch('http://localhost:3000/employees')
        const data = await res.json()
        rows.value = data
        console.log('Loaded:', data)
    } catch (err) {
        console.error('Fetch error:', err)
    } finally {
        loading.value = false
    }
    })
</script>

<template>
  <div class="q-pa-md">
    <q-table
      title="Employee List"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :loading="loading"
      flat
      bordered
      :rows-per-page-options="[10, 20, 50]"
      style="max-height: 500px; overflow-y: auto;"
      class="scroll"
    />
  </div>
</template>

<style scoped>
.q-pa-md {
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

</style>

