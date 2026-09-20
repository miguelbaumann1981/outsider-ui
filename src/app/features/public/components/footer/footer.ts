import { Component, signal } from '@angular/core';

@Component({
  selector: 'out-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = signal<string>(new Date().getFullYear().toString());

  openSocial(social: string): void {
    if (social === 'Instagram') {
      window.open('', '_blank', 'noopener,noreferrer');
    }
    if (social === 'Facebook') {
      window.open('', '_blank', 'noopener,noreferrer');
    }

    if (social === 'Gmail') {
      window.location.href = 'mailto:outsiderrevista@gmail.com';
    }
  }

  mailTo(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
