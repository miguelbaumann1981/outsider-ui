import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeader } from '../../components/admin-header/admin-header';
import { publicLayoutPage } from '@/features/public/utils';
import es from '@/i18n/es.json';
import { AuthService } from '@/auth/services';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminHeader],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  protected readonly i18n = es;
  authService = inject(AuthService);
  layoutPage = signal<string>(publicLayoutPage);
}
