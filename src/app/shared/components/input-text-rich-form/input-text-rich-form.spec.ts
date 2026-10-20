import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextRichForm } from './input-text-rich-form';
import { DebugElement, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

describe('InputTextRichForm Component', () => {
  let component: InputTextRichForm;
  let fixture: ComponentFixture<InputTextRichForm>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextRichForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextRichForm);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    const testField = TestBed.runInInjectionContext(() => form(signal('Test')));
    fixture.componentRef.setInput('formField', testField);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the right text in input', () => {
    const input = de.query(By.css('ngx-editor')).nativeElement;
    expect(input.textContent).toBe('Test');
  });
});
