import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UnderConstructionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: null
  ) { }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
