import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CategoriaComponent } from './categoria.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CategoriaComponent', () => {
  function createComponentWithSlug(slug: string) {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CategoriaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug }))
          }
        }
      ]
    });

    const fixture = TestBed.createComponent(CategoriaComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should filter products by slug from the route param', () => {
    const component = createComponentWithSlug('familiares');

    expect(component.categoria()?.slug).toBe('familiares');
    expect(component.productos().every(producto => producto.categoria === 'familiares')).toBeTrue();
    expect(component.productos().length).toBeGreaterThan(0);
  });

  it('should return null category if slug is invalid', () => {
    const component = createComponentWithSlug('no-existe');

    expect(component.categoria()).toBeNull();
    expect(component.productos()).toEqual([]);
  });
});
