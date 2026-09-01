import { Component, computed, input } from '@angular/core';
import es from '@/i18n/es.json';
import { textTeal600 } from '@/features/public/utils';

@Component({
  selector: 'out-subtitle-page',
  imports: [],
  templateUrl: './subtitle-page.html',
  styles: `
    .icon {
      font-size: 30px;
    }
  `,
})
export class SubtitlePage {
  protected readonly i18n = es;

  text = input.required<string>();
  icon = input<string>('auto_stories');
  color = input<string>();

  colorIcon = computed<string>(() => this.color() ?? textTeal600);
}
