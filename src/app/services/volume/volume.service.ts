import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VolumeDTO } from './volume.model';

@Injectable({
  providedIn: 'root',
})
export class VolumeService {
  constructor(private http: HttpClient) {}

  getVolumes(numeroConferencia: number): Observable<VolumeDTO[]> {
    return this.http.get<VolumeDTO[]>('/volumes', {
      params: { numeroConferencia },
    });
  }
}
