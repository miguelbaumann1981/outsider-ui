import { Component, inject } from '@angular/core';
import es from '@/i18n/es.json';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'out-confirm-current-release-dialog',
  imports: [],
  templateUrl: './confirm-current-release-dialog.html',
})
export class ConfirmCurrentReleaseDialog {
  protected readonly i18n = es;
  readonly dialogRef = inject(MatDialogRef<ConfirmCurrentReleaseDialog>);

  onClose(isCurrent?: boolean): void {
    this.dialogRef.close(isCurrent);
  }
}
