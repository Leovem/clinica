import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudenPageComponent } from './pages/studen-page/studen-page.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { HorarioPageComponent } from './pages/horario-page/horario-page.component';
import { FichasComponent } from './pages/fichas/fichas.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { CitasMedicasPageComponent } from './pages/citas-medicas-page/citas-medicas-page.component';
import { HistorialMedicoPageComponent } from './pages/historial-medico-page/historial-medico-page.component';
import { EspecialidadesReporteComponent } from './pages/especialidades-reporte/especialidades-reporte.component';
import { FichasReporteComponent } from './pages/fichas-reporte/fichas-reporte.component';
import { MedicosReporteComponent } from './pages/medicos-reporte/medicos-reporte.component';
import { SuspenderCitaComponent } from './pages/suspender-cita/suspender-cita.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'especialidades',
        component: StudenPageComponent
      },
      {
        path: 'medicos',
        component: MedicoComponent
      },
      {
        path: 'pacientes',
        component: PacientesComponent
      },
      {
        path: 'roles',
        component: RolesPageComponent
      },
      {
        path: 'horarios',
        component: HorarioPageComponent
      },
      {
        path: 'citas',
        component: CitasMedicasPageComponent
      },
      {
        path: 'historial-medico/:id',
        component: HistorialMedicoPageComponent
      },
      {
        path: 'fichas/:id',
        component: FichasComponent
      },
      {
        path: 'reporte/especialidades',
        component: EspecialidadesReporteComponent
      },
      {
        path: 'reporte/fichas',
        component: FichasReporteComponent
      },
      {
        path: 'reporte/medicos',
        component: MedicosReporteComponent
      },
      {
        path: 'historial-medico/suspender/:id',
        component: SuspenderCitaComponent
      },
      {
        path: '**',
        redirectTo: 'especialidades'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
