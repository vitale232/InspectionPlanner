import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatTooltipModule,
  MatBadgeModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
  ]
})
export class MaterialModule {}
