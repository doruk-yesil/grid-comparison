<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import RevoGrid from '@revolist/vue3-datagrid'

export default defineComponent({
  name: 'RevoGridDemo',
  components: { RevoGrid },
  setup() {
    const rows = ref<any[]>([])
    const columns = ref<Array<{ prop: string; key: string; name: string; size: number; sortable: boolean; resizable: boolean; autoSizeColumn: boolean }>>([])

    onMounted(async () => {
      const res = await fetch('http://localhost:3000/employees')
      const data = await res.json()
      console.log('Fetched:', data)

      if (!data || data.length === 0) return;

      rows.value = data

      columns.value = Object.keys(data[0]).map(key => ({
        prop: key,
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        size: 150,
        sortable: true,
        resizable: true,
        autoSizeColumn: true
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
  <div class="revo-wrapper">
    <RevoGrid
      :columns="columns"
      :source="rows"
      theme="material"
      :resize="true"
      :range="true"
      :rowHeaders="true"
      :editable="true"
      :autoSizeColumn="true"
    />
  </div>
</template>

<style scoped>
.revo-wrapper {
  padding: 2rem;
  max-width: 100%;
  overflow-x: auto;
}
</style>
