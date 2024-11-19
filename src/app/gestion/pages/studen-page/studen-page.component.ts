import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EspecialidadService } from '../../services/especialidad.service';

import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-studen-page',
  templateUrl: './studen-page.component.html',
  styleUrls: ['./studen-page.component.css']
})
export class StudenPageComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'nombre', 'description', 'accion'];
  public dataSource: any;
  @ViewChild(MatSort)
  public sort!: MatSort;

  @ViewChild('alertForm') alertForm!: TemplateRef<any>;
  public alertRef!: MatDialogRef<any>;

  public custonForm: FormGroup = this.formBuilder.group({
    'nombre': ['', Validators.required],
    'description': ['', Validators.required]
  });

  public especialidades: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private especialidadService: EspecialidadService, private toastr: ToastrService, private reporteService: ReporteService) {
    this.especialidadService.getEspecialidades()
    .pipe(
      catchError(error => {
        this.toastr.error('Error al cargar los datos');
        return of([])
      })
    )
    .subscribe((response: any[]) => {
      console.log(response)
      this.especialidadService.setEspecialidades(response);
      this.especialidades = this.especialidadService.especialidades
      this.dataSource = new MatTableDataSource<any>(this.especialidades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngOnInit(): void {
    this.getEspecialidades();
  }

  public openDialog() {
    this.alertRef = this.dialog.open(this.alertForm);
  }

  public fieldValidator(name: string): boolean | null {
    return this.custonForm.controls[`${name}`].errors && this.custonForm.controls[`${name}`].touched;
  }

  public changeSelect(event: any): void {
    this.custonForm.patchValue({
      [`${event.target.name}`]: event.target.value
    })
  }

  public submitForm(): void {
    if (this.custonForm.invalid) {
      this.custonForm.markAllAsTouched();
      this.toastr.warning('Rellene los campos obligatorios');
    } else {
      this.especialidadService.registerEspecialidad(this.custonForm.value)
        .pipe(
          catchError(err => {
             this.toastr.error('Especialidad no agregada');
            console.log(err);
            throw new Error(err);
          }
          )
        )
        .subscribe(() => {
          //TODO REGISTRER ESPECIALIDADES.
          this.toastr.success('Especialidad agregada exitosamente');
          this.custonForm.reset();
          this.ngOnInit();
          this.alertRef.close();
        });
    }
  }

  private resetForm(): void {
    this.custonForm.patchValue({
      name: '',
      description: '',
      state: ''
    });
    this.custonForm.markAsUntouched();
  }

  public getEspecialidades() {
    this.especialidadService.getEspecialidades()
    .pipe(
      catchError(error => {
        this.toastr.error('Error al cargar los datos');
        return of([])
      })
    )
    .subscribe((response: any[]) => {
      console.log(response)
      this.especialidadService.setEspecialidades(response);
      this.especialidades = this.especialidadService.especialidades
      this.dataSource = new MatTableDataSource<any>(this.especialidades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  public handleGoToEditPage(id: number) {
    console.log(id);

  }

  public handleDeleteProduct(id: number) {
    if (id) {
      Swal.fire({
        title: 'Seguro de desea eliminar esta especialidad?',
        text: "Los cambios no se podran revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          //TODO DELETE ESPECIALIDAD:
          this.especialidadService.deleteEspecialidadById(id)
          .pipe(
            catchError( error => {
              this.toastr.error('Error al eliminar el especialidad');
              throw new Error(error);
            })
          )
          .subscribe( (response: any) => {
            this.toastr.success('Especialidad eliminado correctamente');
            this.ngOnInit();
          });
        }
      })
    }
  }


}
