import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ReleasesService } from '../../services/releases.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReleaseObj } from '../../interfaces';
import { ReleasePipe } from '../../pipes';
import { Router } from '@angular/router';
import { Release } from '../../enums';
import { LocalStorageService } from '@/core/services/local-storage.service';

@Component({
  selector: 'out-releases-page',
  imports: [ReleasePipe],
  templateUrl: './releases-page.html',
})
export class ReleasesPage implements OnInit {
  private releasesService = inject(ReleasesService);
  private destroyRef = inject(DestroyRef);
  private localStorageService = inject(LocalStorageService);
  router = inject(Router);

  releases = signal<ReleaseObj[]>([]);

  ngOnInit(): void {
    this.getReleasesApi();
  }

  getReleasesApi(): void {
    this.releasesService
      .getReleases()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.releases.set(data?.releases);
      });
  }

  navigateToReleasePage(release: Release): void {
    this.localStorageService.setItem('release', release);
    const currentRelease = this.localStorageService.getItem('release');

    this.router.navigate([currentRelease === Release.CURRENT ? '/' : `/release/${release}`]);
  }
}
