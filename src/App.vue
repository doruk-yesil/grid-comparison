<script setup lang="ts">
import SyncfusionDemo from './components/SyncfusionDemo.vue'
import AgGridDemo from './components/Ag-GridDemo.vue'
import PrimeVueDemo from './components/PrimeVueDemo.vue'
import TanStackDemo from './components/TanStackDemo.vue'
import GridJsDemo from './components/GridJsDemo.vue'
import RevoGridDemo from './components/RevoGridDemo.vue'
import QuasarDemo from './components/QuasarDemo.vue'
import DevExtremeDemo from './components/DevExtremeDemo.vue'
import TelerikDemo from './components/TelerikDemo.vue'
import { ref } from 'vue'
const gridSelected = ref('telerik')
const handleGridSelection=(grid: string)=>{
  gridSelected.value=grid
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
        <button class="btn btn-secondary m-1 px-4 py-2 fs-5" @click="handleGridSelection('ag-grid')">Ag-Grid</button>
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
        <div v-else-if="gridSelected==='tanstack'">
          <h2 class="text-center m-2">TanStack Grid</h2>
          <TanStackDemo/>
        </div>
        <div v-else-if="gridSelected==='gridjs'">
          <h2 class="text-center m-2">Grid.js Grid</h2>
          <GridJsDemo/>
        </div>
        <div v-else-if="gridSelected==='revogrid'">
          <h2 class="text-center m-2">RevoGrid Grid</h2>
          <RevoGridDemo/>
        </div>
        <div v-else-if="gridSelected==='quasar'">
          <h2 class="text-center m-2">Quasar Grid</h2>
          <QuasarDemo/>
        </div>
        <div v-else-if="gridSelected==='devextreme'">
          <h2 class="text-center m-2">DevExtreme Grid</h2>
          <DevExtremeDemo/>
        </div>
        <div v-else-if="gridSelected==='telerik'">
          <h2 class="text-center m-2">Telerik Grid</h2>
          <TelerikDemo/>
        </div>
      </div>
    </div>
  </div>
</template>

