import { Component, computed, input, output } from '@angular/core';
import es from '@/i18n/es.json';
import { getFontFamilyCategory } from '@/features/public/utils';
import { ArticleCategory } from '@/features/public/enums';

@Component({
  selector: 'out-title-page',
  imports: [],
  templateUrl: './title-page.html',
})
export class TitlePage {
  protected readonly i18n = es;

  text = input.required<string>();
  category = input<ArticleCategory | undefined>(undefined);
  return = output<void>();

  get fontFamilySelected(): string {
    if (!this.category()) {
      return 'text-teal-600';
    }

    return getFontFamilyCategory(this.category()!);
  }
}
