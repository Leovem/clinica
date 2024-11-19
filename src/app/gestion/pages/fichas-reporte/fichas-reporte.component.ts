import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Location } from '@angular/common';
import { FichasService } from '../../services/fichas.service';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-fichas-reporte',
  templateUrl: './fichas-reporte.component.html',
  styleUrls: ['./fichas-reporte.component.css']
})
export class FichasReporteComponent implements OnInit {
  public id: string | null = null;
  public fichas: any = null;
  public displayedColumns: string[] = ['id', 'fecha', 'especialidad', 'cantidad', 'cantidad_vendida', 'dia', 'hora', 'medico'];
  public dataSource: any;
  @ViewChild(MatSort)
  public sort!: MatSort;

  @ViewChild('alertFormFichas') alertFormFichas!: TemplateRef<any>;
  public alertRefFichas!: MatDialogRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private fichasService: FichasService
  ) {
    // this.getFichas();
  }

  public ngOnInit(): void {
    this.getFichas();
  }

  public custonFormFichas: FormGroup = this.formBuilder.group({
    'title': ['', Validators.required],
    'description': ['', Validators.required],
    'pacienteId': ['', Validators.required]
  });



  public submitFormFichas(): void {

  }

  public getFichas() {
    this.fichasService.getFichas()
    .pipe(
      catchError(error => {
        this.toastr.error('Error al cargar los datos');
        return of([])
      })
    )
    .subscribe((response: any[]) => {
      console.log(response)
      this.fichasService.setFichas(response);
      this.fichas = this.fichasService.fichas;
      this.dataSource = new MatTableDataSource<any>(this.fichas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  generatePDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Medicos', 10, 10);
    autoTable(doc, {
      head: [this.displayedColumns],
      body: this.fichas.map((ficha:any) => [ficha.id, ficha.fecha, ficha.horarioEspecialidad.medico.especialidad, ficha.cantidad, ficha.cantidadVendidad, ficha.horarioEspecialidad.horario.dia.nombre, `${ficha.horarioEspecialidad.horario.hora_inicio} -  ${ficha.horarioEspecialidad.horario.hora_fin}`, ficha.horarioEspecialidad.medico.user.nombre]),
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Color del encabezado
      bodyStyles: { textColor: [50, 50, 50] },   // Color del texto
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Filas alternas
      startY: 20, // Posición inicial en Y
    });
    doc.save('reporte.pdf');
  }

  generateExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.fichas.map((ficha:any) => [ficha.id, ficha.fecha, ficha.horarioEspecialidad.medico.especialidad, ficha.cantidad, ficha.cantidadVendidad, ficha.horarioEspecialidad.horario.dia.nombre, `${ficha.horarioEspecialidad.horario.hora_inicio} -  ${ficha.horarioEspecialidad.horario.hora_fin}`, ficha.horarioEspecialidad.medico.user.nombre]));
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
