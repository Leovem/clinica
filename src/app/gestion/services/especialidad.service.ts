import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private APIURL: string = environment.serverApi
  private _especialidades: any[] = [];

  constructor(private http: HttpClient) { }

  public get especialidades() {
    return this._especialidades
  }

  public setEspecialidades(especialidades: any[]): void {
    this._especialidades = especialidades;
  }

  public getEspecialidades(): Observable<any[]> {
    const url = `${this.APIURL}/especialidades`
    return this.http.get<any[]>(url);
  }

  public getEspecialidadById(id: number): Observable<any> {
    const url = `${this.APIURL}/especialidades/${id}`;
    return this.http.get<any>(url);
  }

  public registerEspecialidad(data: any): Observable<any> {
    const url = `${this.APIURL}/especialidades`;
    return this.http.post<any>(url, data);
  }

  public updateEspecialidadById(id: number, data: any): Observable<any>  {
    const url = `${this.APIURL}/especialidades/${id}`;
    return this.http.put<any>(url, data);
  }

  public deleteEspecialidadById(id: number): Observable<any> {
    const url = `${this.APIURL}/especialidades/${id}`;
    return this.http.delete<any>(url);
  }
}
