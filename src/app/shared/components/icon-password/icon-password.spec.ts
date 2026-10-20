import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconPassword } from './icon-password';

describe('IconPassword Component', () => {
  let component: IconPassword;
  let fixture: ComponentFixture<IconPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(IconPassword);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
});
