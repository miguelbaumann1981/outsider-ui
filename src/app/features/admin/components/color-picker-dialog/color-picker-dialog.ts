import { Component, inject, model } from '@angular/core';
import { ColorPicker } from '../color-picker/color-picker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'out-color-picker-dialog',
  imports: [ColorPicker],
  templateUrl: './color-picker-dialog.html',
})
export class ColorPickerDialog {
  readonly dialogRef = inject(MatDialogRef<ColorPickerDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  color = model<string>('');

  onClose(color?: string): void {
    this.dialogRef.close(color ?? this.color());
  }
}
