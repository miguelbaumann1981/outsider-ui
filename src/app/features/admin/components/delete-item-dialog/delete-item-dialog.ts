import { Component, inject } from '@angular/core';
import es from '@/i18n/es.json';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'out-delete-item-dialog',
  imports: [],
  templateUrl: './delete-item-dialog.html',
})
export class DeleteItemDialog {
  protected readonly i18n = es;
  readonly dialogRef = inject(MatDialogRef<DeleteItemDialog>);

  onClose(isCurrent?: boolean): void {
    this.dialogRef.close(isCurrent);
  }
}
