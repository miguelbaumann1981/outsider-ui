import { Component, signal } from '@angular/core';
import es from '@/i18n/es.json';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Outsider-UI');
  protected readonly i18n = es;
}
