import { Component, inject, model } from '@angular/core';
import { ColorPicker } from '../color-picker/color-picker';
import { MatDialogRef } from '@angular/material/dialog';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-color-picker-dialog',
  imports: [ColorPicker],
  templateUrl: './color-picker-dialog.html',
})
export class ColorPickerDialog {
  protected readonly i18n = es;
  readonly dialogRef = inject(MatDialogRef<ColorPickerDialog>);
  color = model<string>('');

  onClose(color?: string): void {
    this.dialogRef.close(color ?? this.color());
  }
}
