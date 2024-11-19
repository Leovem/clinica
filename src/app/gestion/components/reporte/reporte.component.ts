import { Component } from '@angular/core';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent {

  public arrayData: [] = [];
  public displayedColumns: string[] = [];
  public title = "";

  generatePDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Medicos', 10, 10);
    autoTable(doc, {
      head: [this.displayedColumns],
      body: this.arrayData,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Color del encabezado
      bodyStyles: { textColor: [50, 50, 50] },   // Color del texto
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Filas alternas
      startY: 20, // Posición inicial en Y
    });
    doc.save(`${this.title}.pdf`);
  }

  generateExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.arrayData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.title);
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveExcelFile(excelBuffer, this.title);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    saveAs(blob, `${fileName}.xlsx`);
  }
}
