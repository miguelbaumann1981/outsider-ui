import { Component } from '@angular/core';
import es from '@/i18n/es.json';

@Component({
  selector: 'out-maintenance-page',
  imports: [],
  templateUrl: './maintenance-page.html',
})
export class MaintenancePage {
  protected readonly i18n = es;
}
