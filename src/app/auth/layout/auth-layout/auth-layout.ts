import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import es from '@/i18n/es.json';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  protected readonly i18n = es;
}
