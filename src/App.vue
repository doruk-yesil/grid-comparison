<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'

const gridKeys = [
  'syncfusion',
  'aggrid',
  'primevue',
  'tanstack',
  'gridjs',
  'revogrid',
  'quasar',
  'devextreme',
  'telerik'
] as const

type GridKey = typeof gridKeys[number]

const gridSelected = ref<GridKey>('syncfusion')

const componentMap: Record<GridKey, () => Promise<any>> = {
  syncfusion: () => import('./components/SyncfusionDemo.vue'),
  aggrid: () => import('./components/Ag-GridDemo.vue'),
  primevue: () => import('./components/PrimeVueDemo.vue'),
  tanstack: () => import('./components/TanStackDemo.vue'),
  gridjs: () => import('./components/GridJsDemo.vue'),
  revogrid: () => import('./components/RevoGridDemo.vue'),
  quasar: () => import('./components/QuasarDemo.vue'),
  devextreme: () => import('./components/DevExtremeDemo.vue'),
  telerik: () => import('./components/TelerikDemo.vue')
}

const LazyGridComponent = computed(() =>
  defineAsyncComponent(componentMap[gridSelected.value])
)

const handleGridSelection = (grid: GridKey) => {
  gridSelected.value = grid
}
</script>



<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h1 class="m-5">Welcome to Grid Comparison Demo</h1>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('primevue')">PrimeVue</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('tanstack')">TanStack</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('revogrid')">RevoGrid</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('quasar')">Quasar</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('gridjs')">Grid.js</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('devextreme')">DevExtreme</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('telerik')">Telerik</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('syncfusion')">Syncfusion</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('aggrid')">Ag-Grid</button>
      </div>
      <div class="col-12">
        <component :is="LazyGridComponent" />
      </div>
    </div>
  </div>
</template>

