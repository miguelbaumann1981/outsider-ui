import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Footer Component', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should open Instagram social media', () => {
    const social = 'Instagram';
    const url = 'https://www.instagram.com/outsiderrevista?stkn=MXhzd2J1a2k3ZjdraA%3D%3D';
    const spy = vi.spyOn(window, 'open');
    component.openSocial(social);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');

    const spy2 = vi.spyOn(component, 'openSocial');
    de.query(By.css('#instagram')).nativeElement.click();
    expect(spy2).toHaveBeenCalled();
  });

  it('should open Facebook social media', () => {
    const social = 'Facebook';
    const url =
      'https://www.facebook.com/people/Outsider-revista-literaria-subterr%C3%A1nea/61594442236486/?rdid=1KNEd12Kj0wRm1Pu&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19VdUNQwBg%2F';
    const spy = vi.spyOn(window, 'open');
    component.openSocial(social);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');

    const spy2 = vi.spyOn(component, 'openSocial');
    de.query(By.css('#facebook')).nativeElement.click();
    expect(spy2).toHaveBeenCalled();
  });

  it('should open Gmail social media', () => {
    const mailToSpy = vi.spyOn(component, 'mailTo');
    component.openSocial('Gmail');
    expect(mailToSpy).toHaveBeenCalledWith('outsiderrevista@gmail.com');

    const spy2 = vi.spyOn(component, 'openSocial');
    de.query(By.css('#gmail')).nativeElement.click();
    expect(spy2).toHaveBeenCalled();
  });
});
