import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import {
  ChromePickerComponent,
  Color,
  ColorPickerControl,
  ColorType,
} from '@iplab/ngx-color-picker';

@Component({
  selector: 'out-color-picker',
  imports: [ChromePickerComponent],
  templateUrl: './color-picker.html',
  host: {
    'style.background-color': 'background()',
    '(click)': 'showColorPicker($event)',
  },
})
export class ColorPicker {
  private _color: Color | null = null;

  public colorControl = new ColorPickerControl();

  public isVisible: boolean = false;

  protected background: Signal<string | null> = computed(() => {
    return this._color ? this._color.toHexString() : null;
  });

  public color: InputSignal<string> = input<string, string>('', {
    transform: (value: string) => {
      this.colorControl.setValueFrom(value);
      this._color = this.colorControl.value;
      return value;
    },
  });

  public colorChange: OutputEmitterRef<string> = output<string>();

  public showColorPicker(event: MouseEvent) {
    if (this.isVisible === true) {
      return;
    }

    this.isVisible = !this.isVisible;
  }

  public applyClick(event: MouseEvent): void {
    event.stopPropagation();
    this._color = this.colorControl.value;
    this.colorChange.emit(this.getValueByType(this.colorControl.value, this.colorControl.initType));
    this.isVisible = false;
  }

  public discardClick(event: MouseEvent): void {
    event.stopPropagation();
    this.isVisible = false;
  }

  getValueByType(value: Color, initType: ColorType | null): string {
    const color = value as Color & Record<string, () => string>;

    switch (String(initType).toLowerCase()) {
      case 'rgb':
        return color.toRgbString();
      case 'hsl':
        return color.toHslString();
      case 'hsv':
        return color.toHsvString();
      case 'cmyk':
        return color.toCmykString();
      case 'hex':
      default:
        return color.toHexString();
    }
  }
}
