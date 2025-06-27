// src/shims-gridjs.d.ts
declare module 'gridjs-vue' {
  import { DefineComponent } from 'vue'
  const Grid: DefineComponent<any, any, any>
  export { Grid }
}
