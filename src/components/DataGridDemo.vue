<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { DataGridVue } from 'data-grid-vue'

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
  name: 'DataGridDemo',
  components: { DataGridVue },
  setup() {
    const rows = ref<Employee[]>([])
    const columns = ref<{ id: string; title: string }[]>([])

    onMounted(async () => {
      const res = await fetch('http://localhost:3000/employees')
      const data = await res.json()
      rows.value = data

      columns.value = Object.keys(data[0]).map(key => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1)
      }))
    })

    return {
      rows,
      columns
    }
  }
})
</script>

<template>
  <div class="data-grid-wrapper">
    <DataGridVue
      :data="rows"
      :columns="columns"
      :pagination="true"
      :pageSize="10"
      :sortable="true"
      :resizable="true"
      :searchable="true"
      height="500px"
    />
  </div>
</template>

<style scoped>
.data-grid-wrapper {
  padding: 2rem;
}
</style>
