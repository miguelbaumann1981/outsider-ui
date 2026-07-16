import { Component, signal } from '@angular/core';
import { ArticleCardFullWidth } from '../../components/article-card-full-width/article-card-full-width';
import { ArticleCardNarrow } from '../../components/article-card-narrow/article-card-narrow';
import { ArticleCardMediumLeft } from '../../components/article-card-medium-left/article-card-medium-left';
import { ArticleCardMediumCenter } from '../../components/article-card-medium-center/article-card-medium-center';
import { ArticleCardRightContent } from '../../components/article-card-right-content/article-card-right-content';
import { ArticleCardDiagonalContent } from '../../components/article-card-diagonal-content/article-card-diagonal-content';

@Component({
  selector: 'out-home-page',
  imports: [
    ArticleCardFullWidth,
    ArticleCardNarrow,
    ArticleCardMediumLeft,
    ArticleCardMediumCenter,
    ArticleCardRightContent,
    ArticleCardDiagonalContent,
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  isShown = signal(true);
}
