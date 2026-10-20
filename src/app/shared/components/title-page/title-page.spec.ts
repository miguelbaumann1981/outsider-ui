import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitlePage } from './title-page';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('TitlePage Component', () => {
  let component: TitlePage;
  let fixture: ComponentFixture<TitlePage>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitlePage],
    }).compileComponents();

    fixture = TestBed.createComponent(TitlePage);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.componentRef.setInput('text', 'Test title');
    fixture.componentRef.setInput('category', 'TALES');
    fixture.componentRef.setInput('icon', 'auto_stories');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the title and icon with color', () => {
    fixture.componentRef.setInput('color', 'rgb(170, 170, 170)');
    fixture.detectChanges();

    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent).toBe('Test title');

    const icon = de.query(By.css('.icon-book')).nativeElement;
    expect(icon.textContent.trim()).toBe('auto_stories');
    expect(icon.style.color).toBe('rgb(170, 170, 170)');
  });

  it('should display the title and icon with color by default', () => {
    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent).toBe('Test title');

    const icon = de.query(By.css('.icon-book')).nativeElement;
    expect(icon.textContent.trim()).toBe('auto_stories');
    expect(icon.style.color).toBe('rgb(0, 150, 137)');
  });

  it('should emit return when the back button is clicked', () => {
    const emitSpy = vi.spyOn(component.return, 'emit');
    de.query(By.css('button')).nativeElement.click();
    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
