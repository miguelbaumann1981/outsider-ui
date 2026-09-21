import { Service } from '@angular/core';

@Service()
export class ShareSocialService {
  shareOnFacebook(url: string) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnTwitter(url: string, text: string) {
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
}
