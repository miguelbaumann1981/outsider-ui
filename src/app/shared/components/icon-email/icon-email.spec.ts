import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconEmail } from './icon-email';

describe('IconEmail Component', () => {
  let component: IconEmail;
  let fixture: ComponentFixture<IconEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconEmail],
    }).compileComponents();

    fixture = TestBed.createComponent(IconEmail);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
});
