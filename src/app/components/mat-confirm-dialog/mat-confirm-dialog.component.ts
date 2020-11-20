import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.css']
})
export class MatConfirmDialogComponent implements OnInit {

  disableBtn = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<MatConfirmDialogComponent>) { }


  ngOnInit() {
  }

  checkedYes(event) {
    if ( event.target.checked ) {
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
