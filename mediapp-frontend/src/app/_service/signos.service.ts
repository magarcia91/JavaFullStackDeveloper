import { Signos } from '../_model/signos';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignosService {
    signosCambio = new Subject<Signos[]>();
    mensajeCambio = new Subject<string>();

    url: string = `${environment.HOST}/signos`;

    constructor(private http: HttpClient) { }

    listar(){
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.get<Signos[]>(this.url, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    listarPageable(p: number, s: number) {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    listarPorId(idSignos: number) {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.get<Signos>(`${this.url}/${idSignos}`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    registrar(signos: Signos) {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.post(this.url, signos, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    modificar(signos: Signos) {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.put(this.url, signos, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }

    eliminar(idSignos: number) {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return this.http.delete(`${this.url}/${idSignos}`, {
            headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
        });
    }
}
