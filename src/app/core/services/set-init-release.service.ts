import { inject, Service } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ReleasesService } from '@/features/public/services';
import { ReleaseLocalStorage } from '@/features/public/interfaces';

@Service()
export class SetInitReleaseService {
  private localStorageService = inject(LocalStorageService);
  private releasesService = inject(ReleasesService);

  setInitReleaseLocalStorage(): void {
    this.releasesService.getReleases().subscribe((data) => {
      const release: ReleaseLocalStorage = {
        code: data.find((item) => item.isCurrentRelease)?.releaseCode ?? '',
        isCurrent: true,
      };
      this.localStorageService.setItem('release', JSON.stringify(release));
    });
  }
}
