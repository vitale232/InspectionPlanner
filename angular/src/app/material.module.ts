import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule } from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
  ]
})
export class MaterialModule {}
