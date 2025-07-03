<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  QTable,
  QBtn,
  QInput,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QToggle,
  QIcon
} from 'quasar'
import { exportFile } from 'quasar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const rows = ref<any[]>([])
const loading = ref(true)
const search = ref('')

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

const exportCsv = () => {
  const content = [
    columns.map(col => `"${col.label}"`).join(','),
    ...rows.value.map(row =>
      columns.map(col => `"${row[col.field]}"`).join(',')
    )
  ].join('\r\n')

  exportFile('employees.csv', content, 'text/csv')
}

const exportPdf = () => {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: rows.value.map(row => columns.map(col => row[col.field]))
  })
  doc.save('employees.pdf')
}

const isDialogOpen = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const form = ref<any>({ id: '', name: '', department: '', salary: '', availability: false })
const selected = ref<any[]>([])

const openAddDialog = () => {
  form.value = { id: '', name: '', department: '', salary: '', availability: false }
  dialogMode.value = 'add'
  isDialogOpen.value = true
}

const openEditDialog = () => {
  if (!selected.value.length) return
  form.value = { ...selected.value[0] }
  dialogMode.value = 'edit'
  isDialogOpen.value = true
}

const saveRow = () => {
  if (dialogMode.value === 'add') {
    rows.value.push({ ...form.value })
  } else {
    const index = rows.value.findIndex(r => r.id === form.value.id)
    if (index !== -1) rows.value[index] = { ...form.value }
  }
  isDialogOpen.value = false
}

const deleteRow = () => {
  if (!selected.value.length) return
  const idToDelete = selected.value[0].id
  rows.value = rows.value.filter(row => row.id !== idToDelete)
  selected.value = []
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/employees')
    const data = await res.json()
    rows.value = data
  } catch (err) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-md q-mb-md">
      <q-input
        v-model="search"
        label="Search..."
        debounce="300"
        clearable
        class="col"
        filled
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn label="Export CSV" color="primary" @click="exportCsv" />
      <q-btn label="Export PDF" color="primary" @click="exportPdf" />
      <q-btn label="Add" color="positive" @click="openAddDialog" />
      <q-btn label="Edit" color="warning" :disable="!selected.length" @click="openEditDialog" />
      <q-btn label="Delete" color="negative" :disable="!selected.length" @click="deleteRow" />
    </div>

    <q-table
      title="Employee List"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :loading="loading"
      :filter="search"
      selection="single"
      v-model:selected="selected"
      flat
      style="height: 500px; overflow-y: auto;"
      bordered
      :rows-per-page-options="[10, 20, 50]"
      virtual-scroll
      class="scroll sticky-header"
    />

    <q-dialog v-model="isDialogOpen">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ dialogMode === 'add' ? 'Add Employee' : 'Edit Employee' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.id" label="ID" :disable="dialogMode === 'edit'" dense outlined />
          <q-input v-model="form.name" label="Name" dense outlined class="q-mt-sm" />
          <q-input v-model="form.department" label="Department" dense outlined class="q-mt-sm" />
          <q-input v-model="form.salary" label="Salary" type="number" dense outlined class="q-mt-sm" />
          <q-toggle v-model="form.availability" label="Available" class="q-mt-sm" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="isDialogOpen = false" />
          <q-btn flat label="Save" color="primary" @click="saveRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.q-pa-md {
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}
.sticky-header thead tr {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}
</style>
