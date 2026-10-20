import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { PublicHeader } from './public-header';
import { provideRouter, Router } from '@angular/router';
import { SetInitReleaseService } from '@/core/services';
import { MenuItem } from '@/shared/interfaces/menu-item.interface';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const setInitReleaseServiceMock = {
  releases: { data: vi.fn().mockReturnValue([]) },
};

describe('PublicHeader Component', () => {
  let component: PublicHeader;
  let fixture: ComponentFixture<PublicHeader>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHeader],
      providers: [
        provideRouter([{ path: 'about-us', children: [] }]),
        {
          provide: SetInitReleaseService,
          useValue: setInitReleaseServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicHeader);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the menu with release item as false', () => {
    const api = component.releasesApi;
    const menu: MenuItem[] = [
      {
        text: 'About us',
        url: '/about-us',
        isActive: true,
      },
      {
        text: 'Releases',
        url: '/releases',
        isActive: (api.data.length ?? 0) > 1,
      },
    ];
    expect(menu.length).toBe(2);
    expect(menu[1].isActive).toBe(false);
  });

  it('should close the menu after click', () => {
    component.closeMenuAfterClick();
    expect(component.isDisplayedMenuMobile()).toBe(false);
  });

  it('should call the closeMenuAfterClick method after click', async () => {
    const spy = vi.spyOn(component, 'closeMenuAfterClick');
    component.isDisplayedMenuMobile.set(true);
    component.menu.set([
      {
        text: 'About us',
        url: '/about-us',
        isActive: true,
      },
      {
        text: 'Releases',
        url: '/releases',
        isActive: false,
      },
    ]);
    const anchor = de.query(By.css('.menu .close-menu:first-child')).nativeElement;
    anchor?.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    await fixture.whenStable();
  });

  it('should hide the menu after 1000ms', () => {
    vi.useFakeTimers();
    component.closeMenuAfterClick();
    expect(component.isDisplayedMenuMobile()).toBe(false);

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(component.isDisplayedMenuMobile()).toBe(true);
  });

  it('should call the method navigateToHomePage after click', () => {
    const route = TestBed.inject(Router).url;
    component.navigateToHomePage();
    expect(route).toBe('/');

    const spy = vi.spyOn(component, 'navigateToHomePage');
    const anchor = de.query(By.css('#goHome')).nativeElement;
    anchor.click();
    expect(spy).toHaveBeenCalled();
  });
});
