import { Component } from '@angular/core';
import es from '@/i18n/es.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'out-maintenance-page',
  imports: [RouterLink],
  templateUrl: './maintenance-page.html',
})
export class MaintenancePage {
  protected readonly i18n = es;
}
