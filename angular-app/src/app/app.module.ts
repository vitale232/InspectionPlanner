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
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { SidenavService } from './services/sidenav.service';
import { HttpClientModule } from '@angular/common/http';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    SearchComponent,
    UnderConstructionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    LeafletModule.forRoot(),
  ],
  providers: [
    SidenavService
  ],
  bootstrap: [AppComponent],
  entryComponents: [UnderConstructionComponent]
})
export class AppModule { }
