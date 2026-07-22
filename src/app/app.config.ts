import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { LocalStorageService } from './core/services/local-storage.service';
import { Release } from './features/public/enums';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAppInitializer(() => {
      const localStorageService = inject(LocalStorageService);
      localStorageService.setItem('release', Release.CURRENT);
    }),
  ],
};
