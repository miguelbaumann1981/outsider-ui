import { Component, inject } from '@angular/core';
import es from '@/i18n/es.json';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'out-confirm-current-release-dialog',
  imports: [],
  templateUrl: './confirm-current-release-dialog.html',
})
export class ConfirmCurrentReleaseDialog {
  protected readonly i18n = es;
  readonly dialogRef = inject(MatDialogRef<ConfirmCurrentReleaseDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  onClose(isCurrent?: boolean): void {
    this.dialogRef.close(isCurrent);
  }
}
