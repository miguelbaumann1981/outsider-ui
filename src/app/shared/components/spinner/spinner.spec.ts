import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

describe('Spinner Component', () => {
  let component: Spinner;
  let fixture: ComponentFixture<Spinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner],
    }).compileComponents();

    fixture = TestBed.createComponent(Spinner);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
});
