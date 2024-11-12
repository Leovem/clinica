import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EspecialidadService } from '../../services/especialidad.service';

import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { PacientesService } from '../../services/pacientes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit  {
  public displayedColumns: string[] = ['id', 'nombre', 'apellido', 'ci', 'telefono', 'direccion', 'genero', 'accion'];
  public dataSource: any;
  @ViewChild(MatSort)
  public sort!: MatSort;

  @ViewChild('alertForm') alertForm!: TemplateRef<any>;
  public alertRef!: MatDialogRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public custonForm: FormGroup = this.formBuilder.group({
    'nombre': ['', Validators.required],
    'apellido': ['', Validators.required],
    'ci': ['', Validators.required],
    'telefono': ['', Validators.required],
    'direccion': ['', Validators.required],
    'genero': ['', Validators.required],
    'email': ['', Validators.required],
    'password': ['', Validators.required],
    'tipo': ['Paciente', Validators.required]
  });

  public pacientes: any[] = [];
  public especialidades: any[] = [];

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private pacientesServices: PacientesService,
    private toastr: ToastrService,
    private especialidadService: EspecialidadService,
    private usersServices: UsersService,
    private router: Router
  ) {
    this.getPacientes();
  }

  ngOnInit(): void {
    this.getPacientes();
  }

  public openDialog() {
    this.alertRef = this.dialog.open(this.alertForm);
  }

  public fieldValidator(name: string): boolean | null {
    return this.custonForm.controls[`${name}`].errors && this.custonForm.controls[`${name}`].touched;
  }

  public changeSelect(event: any): void {
    // this.custonForm.patchValue({
    //   [`${event.target.name}`]: event.target.value
    // })
  }

  public submitForm(): void {
    if (this.custonForm.invalid) {
      this.custonForm.markAllAsTouched();
      this.toastr.warning('Rellene los campos obligatorios');
    } else {

    const newPaciente = {
      nombre: this.custonForm.get('nombre')?.value,
      apellido: this.custonForm.get('apellido')?.value,
      ci: this.custonForm.get('ci')?.value,
      email: this.custonForm.get('email')?.value,
      telefono: this.custonForm.get('telefono')?.value,
      direccion: this.custonForm.get('direccion')?.value,
      password: this.custonForm.get('password')?.value,
      genero: this.custonForm.get('genero')?.value,
    };
      this.usersServices.registerUsers(newPaciente)
        .pipe(
          catchError(err => {
            this.toastr.error('Usuario no agregado');
            console.log(err);
            throw new Error(err);
          }
          )
        )
        .subscribe((response: any) => {
          //TODO REGISTRER PACIENTE.
          const newPaciente = {
            tipo: this.custonForm.get('tipo')?.value,
            userId: response.id,
          };
          this.pacientesServices.registerPacientes(newPaciente)
          .pipe(
            catchError(err => {
               this.toastr.error('Paciente no agregado');
              console.log(err);
              throw new Error(err);
            }
            )
          )
          .subscribe((res: any) => {
            this.toastr.success('Paciente agregado exitosamente');
            this.ngOnInit();
            this.custonForm.reset();
            this.alertRef.close();
          });
        });
      }
  }


  public getPacientes() {
    this.pacientesServices.getPacientes()
    .pipe(
      catchError(error => {
        this.toastr.error('Error al cargar los datos');
        return of([])
      })
    )
    .subscribe((response: any[]) => {
      console.log(response)
      this.pacientesServices.setPacientes(response);
      this.pacientes = this.pacientesServices.pacientes;
      this.dataSource = new MatTableDataSource<any>(this.pacientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  public handleGoToEditPage(id: number) {
    console.log(id);
  }

  public handleGoToHistorialMedico(id: number, name: string, lastname: string) {
    console.log(id);
    this.router.navigate(['/gestion/historial-medico', id], { queryParams: { nombre: (name + " " + lastname )} });
  }

  public handleDeleteProduct(id: number) {
    if (id) {
      Swal.fire({
        title: 'Seguro de desea eliminar el paciente?',
        text: "Los cambios no se podran revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          //TODO DELETE MEDICO:
          this.pacientesServices.deletePacientesById(id)
          .pipe(
            catchError( error => {
              this.toastr.error('Error al eliminar el paciente');
              throw new Error(error);
            })
          )
          .subscribe( (response: any) => {
            this.toastr.success('Paciente eliminado correctamente');
            this.ngOnInit();
          });
        }
      })
    }
  }

}
