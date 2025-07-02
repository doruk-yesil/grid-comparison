import { createApp } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import { registerLicense } from '@syncfusion/ej2-base'
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { Quasar } from 'quasar'
import '@progress/kendo-theme-default/dist/all.css';


ModuleRegistry.registerModules([AllEnterpriseModule]);

LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-088974}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{14 July 2025}____[v3]_[0102]_MTc1MjQ0NzYwMDAwMA==3c6193179b095f35a764fb60cf98961e");

registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCeUx0QXxbf1x1ZFRGal1STndZUiweQnxTdEBjX31YcHdVR2NcVk10WkleYw==')

const app=createApp(App)
app.use(PrimeVue, {
  unstyled: false,
  pt: Aura
})
app.use(Quasar, {
  plugins: {},
})

app.mount('#app')
