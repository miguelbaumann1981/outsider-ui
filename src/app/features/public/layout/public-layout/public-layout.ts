import { PublicHeader } from '@/shared/components/public-header/public-header';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'out-public-layout',
  imports: [RouterOutlet, PublicHeader],
  templateUrl: './public-layout.html',
})
export class PublicLayout {}
