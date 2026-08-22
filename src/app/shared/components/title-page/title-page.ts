import { Component, computed, input, output } from '@angular/core';
import es from '@/i18n/es.json';
import { getTextColorCategory } from '@/features/public/utils';
import { ArticleCategory } from '@/features/public/enums';

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
  return = output<void>();

  get color(): string {
    if (!this.category()) {
      return 'text-teal-600';
    }
    return getTextColorCategory(this.category()!);
  }
}
