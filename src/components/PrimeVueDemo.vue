<script lang="ts">
import { defineComponent, ref, onMounted, h } from 'vue'
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

    const availabilityOptions = ref([
      { label: 'True', value: true },
      { label: 'False', value: false }
    ])

    const availabilityFilterTemplate = (options: any) => {
      return h(
        'select',
        {
          class: 'p-dropdown',
          style: 'width: 100%',
          onChange: (e: Event) =>
            options.filterCallback((e.target as HTMLSelectElement).value === 'true')
        },
        [
          h('option', { value: '' }, 'All'),
          ...availabilityOptions.value.map((opt) =>
            h('option', { value: opt.value }, opt.label)
          )
        ]
      )
    }

    return {
      employees,
      availabilityFilterTemplate
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
      <Column field="id" header="Employee ID" sortable filter />
      <Column field="name" header="Full Name" sortable filter />
      <Column field="email" header="Email" filter />
      <Column field="department" header="Department" sortable filter />
      <Column field="salary" header="Salary" sortable filter />
      <Column
        field="availability"
        header="Available"
        filter
        :showFilterMatchModes="false"
        :filterElement="availabilityFilterTemplate"
      />
    </DataTable>
  </div>
</template>

<style scoped>
.prime-vue-demo {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
</style>
