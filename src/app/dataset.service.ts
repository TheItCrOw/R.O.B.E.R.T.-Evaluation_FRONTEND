import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dataset } from './dataset';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  // This is dev
  //private url = 'http://localhost:5200';
  // This is live
  private url = 'https://r-o-b-e-r-t-evaluation-backend.onrender.com';
  private datasets$: Subject<Dataset[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  getRandomUnratedDataset(): Observable<Dataset> {
    return this.httpClient.get<Dataset>(`${this.url}/datasets/unrated`);
  }

  updateDataset(id: string, dataset: Dataset): Observable<string> {
    return this.httpClient.put(`${this.url}/datasets/${id}`, dataset, { responseType: 'text' });
  }
}
