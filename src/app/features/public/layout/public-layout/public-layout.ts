import { PublicHeader } from '@/shared/components/public-header/public-header';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'out-public-layout',
  imports: [RouterOutlet, PublicHeader, Footer],
  templateUrl: './public-layout.html',
})
export class PublicLayout {}
