import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseMapComponent } from './components/base-map/base-map.component';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { SidenavService } from './services/sidenav.service';
import { HttpClientModule } from '@angular/common/http';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { QueryHistoryTableComponent } from './components/query-history-table/query-history-table.component';
import { BrowseModule } from './components/browse/browse.module';


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
  type: 'info'
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BaseMapComponent,
    MapComponent,
    SearchComponent,
    UnderConstructionComponent,
    NotFoundComponent,
    QueryHistoryTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    LeafletModule.forRoot(),
    NgcCookieConsentModule.forRoot(cookieConfig),
    SimpleNotificationsModule.forRoot(),
    AppRoutingModule,
    BrowseModule,
  ],
  providers: [
    SidenavService
  ],
  bootstrap: [AppComponent],
  entryComponents: [UnderConstructionComponent]
})
export class AppModule { }
