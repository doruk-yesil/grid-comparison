<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  createColumnHelper,
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState
} from '@tanstack/vue-table'

type Employee = {
  id: number
  name: string
  department: string
  salary: number
  availability: boolean
  email: string
  location: string
  telephone: string
  assets: string[]
}

export default defineComponent({
  name: 'TanStackDemo',
  setup() {
    const employees = ref<Employee[]>([])
    const table = ref<ReturnType<typeof useVueTable<Employee>>>()
    const sorting = ref<SortingState>([])

    const columnHelper = createColumnHelper<Employee>()
    const columns: ColumnDef<Employee, any>[] = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('department', { header: 'Department' }),
      columnHelper.accessor('salary', { header: 'Salary' }),
      columnHelper.accessor('availability', { header: 'Available' })
    ]

    onMounted(async () => {
      try {
        const res = await fetch('http://localhost:3000/employees')
        const data = await res.json()
        employees.value = data

        table.value = useVueTable({
          data: employees,
          columns,
          state: {
            get sorting() {
              return sorting.value
            }
          },
          onSortingChange: updater => {
            sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
          },
          getSortedRowModel: getSortedRowModel(),
          getCoreRowModel: getCoreRowModel()
        })
      } catch (err) {
        console.error('Failed to fetch data', err)
      }
    })

    return {
      table
    }
  }
})
</script>

<template>
  <div class="tanstack-demo">
    <table v-if="table">
      <thead>
        <tr>
          <th
            v-for="header in table.getHeaderGroups()[0].headers"
            :key="header.id"
            @click="header.column.getCanSort() && header.column.toggleSorting()"
            :style="{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }"
          >
            {{ header.column.columnDef.header }}
            <span>
              {{
                header.column.getIsSorted() === 'asc' ? ' 🔼'
                : header.column.getIsSorted() === 'desc' ? ' 🔽'
                : ''
              }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            {{ cell.getValue() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tanstack-demo {
  padding: 2rem;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #aaa;
  padding: 0.5rem;
  text-align: left;
}
</style>
