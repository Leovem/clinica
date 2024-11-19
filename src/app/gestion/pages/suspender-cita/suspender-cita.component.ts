import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { HistorialesService } from '../../services/historiales.service';
import { Location } from '@angular/common';
import { FichasService } from '../../services/fichas.service';

@Component({
  selector: 'app-suspender-cita',
  templateUrl: './suspender-cita.component.html',
  styleUrls: ['./suspender-cita.component.css']
})
export class SuspenderCitaComponent implements OnInit {
  public id: string | null = null;
  public ficha: any = null;
  public nombre: string = "Historial Medica:";
  fechaControl = new FormControl(new Date());
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private fichasService: FichasService
  ) {
    // this.getFichas();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
     this.nombre = "Suspender Ficha Medica: "+ params['nombre'];
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.custonFormFichas.get("pacienteId")?.setValue(this.id);
    this.getHistorialMedico();
  }

  public custonFormFichas: FormGroup = this.formBuilder.group({
    'motivo': ['', Validators.required],
    'fecha_proxima': ['', Validators.required],
  });



  public submitFormFichas(): void {
    if (this.custonFormFichas.invalid) {
      this.custonFormFichas.markAllAsTouched();
      this.toastr.warning('Rellene los campos obligatorios');
    } else {
        this.fichasService.updateFichasToSuspendidoById(this.id, this.custonFormFichas.value)
        .pipe(
          catchError(err => {
            this.toastr.error('Ficha medica no pospuesta');
            console.log(err);
            throw new Error(err);
          }
          )
        )
        .subscribe((response: any) => {
          this.toastr.success('Ficha medica pospuesta exitosamente');
            this.ngOnInit();
            this.getHistorialMedico();
            this.custonFormFichas.reset();
        });
      }
  }

  public getHistorialMedico() {
    this.fichasService.getFichasById(this.id)
    .pipe(
      catchError(error => {
        this.toastr.warning('El paciente no tiene ficha medica');
        return of([])
      })
    )
    .subscribe((response: any) => {
      console.log(response)
      this.ficha = response;
      if (this.ficha !== null) {
        this.custonFormFichas.patchValue({motivo: this.ficha.motivo, fecha_proxima: this.ficha.fecha_proxima})
      }
    });
  }

  volverAtras() {
    this.location.back()
  }
}
