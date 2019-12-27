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
import { BrowseBridgesModule } from './modules/browse-bridges/browse-bridges.module';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { TemplateGridComponent } from './shared/components/grid-components/template-grid/template-grid.component';
import { AttributeGridComponent } from './shared/components/grid-components/attribute-grid/attribute-grid.component';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
// import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';


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
    NotFoundComponent,
    // TemplateGridComponent,
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
    // PblNgridModule.withCommon([ { component: TemplateGridComponent } ]),

    // PblNgridModule.withCommon([ { component: TemplateGridComponent } ]),
    // PblNgridDragModule,
    // PblNgridTargetEventsModule,
    // PblNgridBlockUiModule,
    // PblNgridTransposeModule,
    // // PblNgridStickyModule,
    // PblNgridStatePluginModule,
    // PblNgridMaterialModule,

    BrowseBridgesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
