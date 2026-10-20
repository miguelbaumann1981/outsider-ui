import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonCard } from './skeleton-card';

describe('SkeletonCard Component', () => {
  let component: SkeletonCard;
  let fixture: ComponentFixture<SkeletonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonCard);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
});
