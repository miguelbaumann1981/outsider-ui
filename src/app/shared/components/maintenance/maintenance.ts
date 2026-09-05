import { Component } from '@angular/core';
import es from '@/i18n/es.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'out-maintenance',
  imports: [RouterLink],
  templateUrl: './maintenance.html',
})
export class MaintenanceComponent {
  protected readonly i18n = es;
}
