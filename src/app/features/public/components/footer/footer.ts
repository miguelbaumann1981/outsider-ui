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
      window.open(
        'https://www.instagram.com/outsiderrevista?stkn=MXhzd2J1a2k3ZjdraA%3D%3D',
        '_blank',
        'noopener,noreferrer',
      );
    }
    if (social === 'Facebook') {
      window.open(
        'https://www.facebook.com/people/Outsider-revista-literaria-subterr%C3%A1nea/61594442236486/?rdid=1KNEd12Kj0wRm1Pu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19VdUNQwBg%2F',
        '_blank',
        'noopener,noreferrer',
      );
    }

    if (social === 'Gmail') {
      window.location.href = 'mailto:outsiderrevista@gmail.com';
    }
  }

  mailTo(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}
