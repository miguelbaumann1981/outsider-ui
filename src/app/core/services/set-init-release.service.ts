import { inject, Service } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ReleasesService } from '@/features/public/services';
import { ReleaseLocalStorage } from '@/features/public/interfaces';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Service()
export class SetInitReleaseService {
  private localStorageService = inject(LocalStorageService);
  private releasesService = inject(ReleasesService);

  readonly releases = injectQuery(() => ({
    queryKey: ['releases'],
    queryFn: () => lastValueFrom(this.releasesService.getReleases()),
    staleTime: 1000 * 60 * 30,
  }));

  setInitReleaseLocalStorage(): void {
    const release: ReleaseLocalStorage = {
      code: this.releases.data()?.find((item) => item.isCurrentRelease)?.releaseCode ?? '',
      isCurrent: true,
    };
    this.localStorageService.setItem('release', JSON.stringify(release));
  }
}
