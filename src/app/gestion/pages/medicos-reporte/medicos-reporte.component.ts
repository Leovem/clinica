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
import { MedicosService } from '../../services/medicos.service';
import { UsersService } from '../../services/users.service';

//PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-medicos-reporte',
  templateUrl: './medicos-reporte.component.html',
  styleUrls: ['./medicos-reporte.component.css']
})
export class MedicosReporteComponent implements OnInit  {
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
    'especialidad': ['', Validators.required],
    'tipo': ['Medico', Validators.required]
  });

  public medicos: any[] = [];
  public especialidades: any[] = [];

  reportDataExcel: any[] = [];

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private medicosService: MedicosService,
    private toastr: ToastrService,
    private especialidadService: EspecialidadService,
    private usersServices: UsersService
  ) {
    this.getMedicos();
    this.getEspecialidades();
  }

  ngOnInit(): void {
    this.getMedicos();
    this.getEspecialidades();
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

    const newEspecialidad = {
      nombre: this.custonForm.get('nombre')?.value,
      apellido: this.custonForm.get('apellido')?.value,
      ci: this.custonForm.get('ci')?.value,
      email: this.custonForm.get('email')?.value,
      telefono: this.custonForm.get('telefono')?.value,
      direccion: this.custonForm.get('direccion')?.value,
      password: this.custonForm.get('password')?.value,
      genero: this.custonForm.get('genero')?.value,
      rolId: 2
    };
      this.usersServices.registerUsers(newEspecialidad)
        .pipe(
          catchError(err => {
            this.toastr.error('Usuario no agregada');
            console.log(err);
            throw new Error(err);
          }
          )
        )
        .subscribe((response: any) => {
          //TODO REGISTRER MEDICO.
          const mewMedico = {
            especialidad: this.custonForm.get('especialidad')?.value,
            tipo: this.custonForm.get('tipo')?.value,
            userId: response.id,
          };
          this.medicosService.registerMedicos(mewMedico)
          .pipe(
            catchError(err => {
               this.toastr.error('Medico no agregado');
              console.log(err);
              throw new Error(err);
            }
            )
          )
          .subscribe((res: any) => {
            this.toastr.success('Medico agregado exitosamente');
            this.ngOnInit();
            this.custonForm.reset();
            this.alertRef.close();
          });
        });
      }
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
      this.especialidades = this.especialidadService.especialidades;

    });
  }

  public getMedicos() {
    this.medicosService.getMedicos()
    .pipe(
      catchError(error => {
        this.toastr.error('Error al cargar los datos');
        return of([])
      })
    )
    .subscribe((response: any[]) => {
      console.log(response)
      this.medicosService.setMedicos(response);
      this.medicos = this.medicosService.medicos;
      this.dataSource = new MatTableDataSource<any>(this.medicos);
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
        title: 'Seguro de desea eliminar el medico?',
        text: "Los cambios no se podran revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          //TODO DELETE MEDICO:
          this.medicosService.deleteMedicosById(id)
          .pipe(
            catchError( error => {
              this.toastr.error('Error al eliminar el medico');
              throw new Error(error);
            })
          )
          .subscribe( (response: any) => {
            this.toastr.success('Medico eliminado correctamente');
            this.ngOnInit();
          });
        }
      })
    }
  }


  generatePDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Medicos', 10, 10);
    autoTable(doc, {
      head: [this.displayedColumns],
      body: this.medicos.map((medico) => [medico.id, medico.user.nombre, medico.user.apellido, medico.user.ci, medico.user.telefono, medico.user.direccion, medico.user.genero]),
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Color del encabezado
      bodyStyles: { textColor: [50, 50, 50] },   // Color del texto
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Filas alternas
      startY: 20, // Posición inicial en Y
    });
    doc.save('reporte.pdf');
  }

  generateExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.medicos.map((medico) => [medico.id, medico.user.nombre, medico.user.apellido, medico.user.ci, medico.user.telefono, medico.user.direccion, medico.user.genero]));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Medicos');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveExcelFile(excelBuffer, 'ReporteMedicos');
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    saveAs(blob, `${fileName}.xlsx`);
  }

}
