import { Component } from '@angular/core';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-maintenance',
  imports: [],
  templateUrl: './maintenance.html',
})
export class MaintenanceComponent {
  protected readonly i18n = es;
}
