import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrowserHistoryService {

  private readonly _currentUrl = new BehaviorSubject<string>( null );
  readonly _currentUrl$ = this._currentUrl.asObservable();

  get currentUrl(): string {
    return this._currentUrl.getValue();
  }

  set currentUrl(val: string) {
    this._currentUrl.next(val);
  }

  private readonly _previousUrl = new BehaviorSubject<string>( null );
  readonly previousUrl$ = this._previousUrl.asObservable();

  get previousUrl(): string {
    return this._previousUrl.getValue();
  }

  set previousUrl(val: string) {
    this._previousUrl.next(val);
  }

  constructor( private router: Router ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
    });
  }
}
