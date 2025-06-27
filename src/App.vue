<script setup lang="ts">
import SyncfusionDemo from './components/SyncfusionDemo.vue'
import AgGridDemo from './components/Ag-GridDemo.vue'
import PrimeVueDemo from './components/PrimeVueDemo.vue'
import { ref } from 'vue'
const gridSelected = ref('primevue')
const handleGridSelection=(grid: string)=>{
  gridSelected.value=grid
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h1 class="m-5">Welcome to Grid Comparison Demo</h1>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('syncfusion')">Syncfusion</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('ag-grid')">Ag-Grid</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('primevue')">PrimeVue</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('...')">...</button>
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection(',,,')">,,,</button>
      </div>
      <div class="col-12">
        <div v-if="gridSelected==='syncfusion'">
          <h2 class="text-center m-2">Syncfusion Grid</h2>
          <SyncfusionDemo class="no-bootstrap"/>
        </div>
        <div v-else-if="gridSelected==='ag-grid'">
          <h2 class="text-center m-2">Ag-Grid Grid</h2>
          <Ag-GridDemo />
        </div>
        <div v-else-if="gridSelected==='primevue'">
          <h2 class="text-center m-2">PrimeVue Grid</h2>
          <PrimeVueDemo/>
        </div>
        <div v-else-if="gridSelected==='...'">
          <h2 class="text-center m-2">aaa Grid</h2>
        </div>
        <div v-else-if="gridSelected===',,,'">
          <h2 class="text-center m-2">bbb Grid</h2>
        </div>
      </div>
    </div>
  </div>
</template>

