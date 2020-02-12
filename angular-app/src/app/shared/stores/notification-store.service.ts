import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationStoreService {
  private readonly _notificationCount = new BehaviorSubject<number>( 0 );
  readonly notificationCount$ = this._notificationCount.asObservable();

  get notificationCount(): number {
    return this._notificationCount.getValue();
  }

  set notificationCount(val: number) {
    this._notificationCount.next(val);
  }

  constructor() { }

  incrementNotificationCount(): void {
    this.notificationCount += 1;
  }

  clearNotificationCount(): void {
    this.notificationCount = 0;
  }

}
