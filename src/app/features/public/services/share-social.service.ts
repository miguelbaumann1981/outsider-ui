import { Service } from '@angular/core';
import { Article } from '../interfaces';

@Service()
export class ShareSocialService {
  shareOnFacebook(url: string) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnX(url: string, text: string) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnWhatsApp(url: string) {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnLinkedIn(url: string) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnInstagramProfile(username: string) {
    const url = `https://www.instagram.com/${username}/`;
    window.open(url, '_blank');
  }

  async shareOnInstagramMobile(url: string, article: Article) {
    if (navigator.share) {
      await navigator.share({
        title: article.titleArticle,
        text: article.content,
        url,
      });
    }
  }

  shareOnInstagramCopy(url: string) {
    navigator.clipboard.writeText(url);
    window.open('https://www.instagram.com/', '_blank');
  }
}
