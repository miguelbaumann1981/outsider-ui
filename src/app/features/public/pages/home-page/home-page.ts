import { Component, signal } from '@angular/core';
import { ArticleHomeCard } from '../../components/article-home-card/article-home-card';

@Component({
  selector: 'out-home-page',
  imports: [ArticleHomeCard],
  templateUrl: './home-page.html',
})
export class HomePage {
  isShown = signal(true);
}
