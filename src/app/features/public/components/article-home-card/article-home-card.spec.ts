import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleHomeCard } from './article-home-card';
import { ArticleCard } from '../../interfaces';
import { ReleaseCode } from '../../types';
import { ArticleCategory } from '../../enums';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const articleMock: ArticleCard = {
  author: 'Paul Auster',
  color: 'rgb(170, 170, 170)',
  hoverColor: '#eeeeee',
  id: 'abc123',
  name: 'Encuentros poéticos en la Tercera Fase',
  position: 2,
  category: 'poetry' as ArticleCategory,
  imageUrl: 'https://encrypted-tbn0.gstatic.com/images',
  releaseCode: 'XXX111' as ReleaseCode,
  slug: 'encuentros-poeticos-en-la-tercera-fase',
  title: 'Poemas',
};

describe('ArticleHomeCard Component', () => {
  let component: ArticleHomeCard;
  let fixture: ComponentFixture<ArticleHomeCard>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleHomeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleHomeCard);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.componentRef.setInput('article', articleMock);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display properties according to the input', () => {
    const image = de.query(By.css('img')).nativeElement;
    expect(image.src).toBe(articleMock.imageUrl);

    const h2 = de.query(By.css('h2')).nativeElement;
    expect(h2.textContent.trim()).toBe(articleMock.name);

    const h3 = de.query(By.css('h3')).nativeElement;
    expect(h3.textContent.trim()).toBe(articleMock.title);

    const p = de.query(By.css('p')).nativeElement;
    expect(p.textContent.trim()).toBe(articleMock.author);

    const divColor = de.query(By.css('#color-separator')).nativeElement;
    expect(divColor.style.backgroundColor).toBe(articleMock.color);
  });
});
