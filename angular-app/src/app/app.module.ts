import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { AngularSplitModule } from 'angular-split';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchModule } from './modules/search/search.module';
import { SimpleNotificationsModule } from 'angular2-notifications';


const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'ipa.timelinetamer.com'
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience.'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    AngularSplitModule.forRoot(),
    SimpleNotificationsModule.forRoot({
      timeOut: 20000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    }),

    SearchModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
