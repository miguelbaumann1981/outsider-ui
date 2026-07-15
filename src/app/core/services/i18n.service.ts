import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Language } from '../types/language.type';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private platformId = inject(PLATFORM_ID);
  private currentLang = signal<Language>('es');
  private translations = signal<Record<string, string>>({});

  constructor() {
    this.loadTranslations('es');
  }

  async loadTranslations(lang: Language) {
    this.currentLang.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      const data = await fetch(`./i18n/${lang}.json`).then((res) => res.json());
      this.translations.set(data);
    }

    if (isPlatformServer(this.platformId)) {
      // SSR → leer archivo directamente desde /public
      const fs = await import('node:fs/promises');
      const path = `./public/i18n/${lang}.json`;

      const raw = await fs.readFile(path, 'utf-8');
      this.translations.set(JSON.parse(raw));
    }
  }

  t(key: string): string {
    return this.translations()[key] ?? key;
  }

  lang() {
    return this.currentLang();
  }

  /*
  ** Template: <button (click)="setLang('en')">EN</button>
  ** TS file: i18nService = inject(I18nService)
  **  setLang(lang: Language) {
        this.i18nService.loadTranslations(lang);
    }
  */
}
