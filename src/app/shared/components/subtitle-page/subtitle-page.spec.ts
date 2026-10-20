import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubtitlePage } from './subtitle-page';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SubtitlePage Component', () => {
  let component: SubtitlePage;
  let fixture: ComponentFixture<SubtitlePage>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtitlePage],
    }).compileComponents();

    fixture = TestBed.createComponent(SubtitlePage);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.componentRef.setInput('text', 'Subtitle test');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the text without icon', () => {
    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent).toBe('Subtitle test');
  });

  it('should display the text title and icon with color', () => {
    fixture.componentRef.setInput('icon', 'save');
    fixture.componentRef.setInput('color', 'rgb(0, 0, 0)');
    fixture.detectChanges();

    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent).toBe('Subtitle test');

    const icon = de.query(By.css('.icon')).nativeElement;
    expect(icon.textContent.trim()).toBe('save');
    expect(icon.style.color).toBe('rgb(0, 0, 0)');
  });

  it('should display the text with icon and color by default', () => {
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();

    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent).toBe('Subtitle test');

    const icon = de.query(By.css('.icon')).nativeElement;
    expect(icon.textContent.trim()).toBe('save');
    expect(icon.style.color).toBe('rgb(0, 150, 137)');
  });

  it('should display the action text', () => {
    fixture.componentRef.setInput('actionText', 'Action text');
    fixture.componentRef.setInput('actionIcon', 'delete');
    fixture.detectChanges();

    const textButton = de.query(By.css('button .action-text')).nativeElement;
    expect(textButton.textContent).toBe('Action text');

    const icon = de.query(By.css('button .material-icons')).nativeElement;
    expect(icon.textContent.trim()).toBe('delete');
  });

  it('should emit actionEvent when click', () => {
    fixture.componentRef.setInput('actionText', 'Action text');
    fixture.detectChanges();
    const spy = vi.spyOn(component.actionEvent, 'emit');
    de.query(By.css('.btn')).nativeElement.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
