import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: 'img[appImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  appImgFallback = input('/assets/foto-libros.jpg'); // route by default

  @HostListener('error', ['$event'])
  onError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.appImgFallback();
  }
}
