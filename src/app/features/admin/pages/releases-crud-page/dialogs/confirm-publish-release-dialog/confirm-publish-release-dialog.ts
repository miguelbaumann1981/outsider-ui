import { Component, inject } from '@angular/core';
import es from '@/i18n/es.json';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'out-confirm-publish-release-dialog',
  imports: [],
  templateUrl: './confirm-publish-release-dialog.html',
})
export class ConfirmPublishReleaseDialog {
  protected readonly i18n = es;
  readonly dialogRef = inject(MatDialogRef<ConfirmPublishReleaseDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  onClose(isPublish?: boolean): void {
    this.dialogRef.close(isPublish);
  }
}
