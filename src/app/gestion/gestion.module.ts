import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudenPageComponent } from './pages/studen-page/studen-page.component';
import { GestionRoutingModule } from './gestion-routing.module';
import { MaterialModule } from '../material/material.module';
import { CardHeaderComponent } from './components/card-header/card-header.component';
import { AlertComponent } from './components/alert/alert.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MedicoComponent } from './pages/medico/medico.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { HorarioPageComponent } from './pages/horario-page/horario-page.component';
import { FichasComponent } from './pages/fichas/fichas.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { HistorialMedicoPageComponent } from './pages/historial-medico-page/historial-medico-page.component';
import { CitasMedicasPageComponent } from './pages/citas-medicas-page/citas-medicas-page.component';
import { EditortextComponent } from './components/editortext/editortext.component';
import { EspecialidadesReporteComponent } from './pages/especialidades-reporte/especialidades-reporte.component';
import { FichasReporteComponent } from './pages/fichas-reporte/fichas-reporte.component';
import { MedicosReporteComponent } from './pages/medicos-reporte/medicos-reporte.component';
import { SuspenderCitaComponent } from './pages/suspender-cita/suspender-cita.component';
import { ReporteComponent } from './components/reporte/reporte.component';


@NgModule({
  declarations: [
    StudenPageComponent,
    CardHeaderComponent,
    AlertComponent,
    EspecialidadesComponent,
    MedicoComponent,
    RolesPageComponent,
    HorarioPageComponent,
    FichasComponent,
    PacientesComponent,
    HistorialMedicoPageComponent,
    CitasMedicasPageComponent,
    EditortextComponent,
    EspecialidadesReporteComponent,
    FichasReporteComponent,
    MedicosReporteComponent,
    SuspenderCitaComponent,
    ReporteComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    GestionRoutingModule,
    MaterialModule,
  ]
})
export class GestionModule { }
