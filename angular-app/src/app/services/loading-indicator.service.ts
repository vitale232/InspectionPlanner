import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  private loading = new Subject<boolean>();

  constructor() { }

  public getLoadingIndicatorState$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public sendLoadingIndicatorState(loadingBool: boolean): void {
    this.loading.next(loadingBool);
  }
}
