import { Component, computed, input, output } from '@angular/core';
import es from '@/i18n/es.json';
import { ArticleCategory } from '@/features/public/enums';
import { textTeal600 } from '@/features/public/utils';

@Component({
  selector: 'out-title-page',
  imports: [],
  templateUrl: './title-page.html',
  styles: `
    .icon-book {
      font-size: 35px;
    }
  `,
})
export class TitlePage {
  protected readonly i18n = es;

  text = input.required<string>();
  category = input<ArticleCategory | undefined>(undefined);
  icon = input<string>('auto_stories');
  color = input<string>();
  return = output<void>();

  colorIcon = computed<string>(() => this.color() ?? textTeal600);
}
