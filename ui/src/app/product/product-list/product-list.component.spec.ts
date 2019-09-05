import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductListComponent} from './product-list.component';
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {AppService} from "../../services/app.service";
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {Observable, of} from "rxjs";

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: DebugElement;
  let http: HttpClient;
  let appService: AppService;
  let containerElement: DebugElement;
  let containerNativeElement: HTMLElement;
  let spy: jasmine.Spy;
  let mockProducts: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [
        // reference the new instance of formBuilder from above
        HttpClient,
        AppService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    appService = TestBed.get(AppService);
    element = fixture.debugElement;

    containerElement = element.query(By.css('.container'));
    containerNativeElement = containerElement.nativeElement;
    mockProducts = [
      {id: 1, name: "Hello world", category: "Ruby", code: "puts 'Hello'", price: 1234}];

    spy = spyOn(appService, 'getProducts').and.returnValue(of(mockProducts));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a title', () => {
    component.title = 'Canter Product List';
    fixture.detectChanges();
    expect(containerNativeElement.textContent).toContain(component.title);
  });

  it('should have a table to display the pastes', () => {
    expect(containerNativeElement.innerHTML).toContain("thead");
    expect(containerNativeElement.innerHTML).toContain("tbody");
  });


  it('should show the product list after getProducts promise resolves', async () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.products).toEqual(jasmine.objectContaining(mockProducts));
      expect(containerNativeElement.innerText.replace(/\s\s+/g, ' ')).toContain(mockProducts[0].name);
    });
  });


  it('should delete the product from products list on clicking the delete button', async () => {

    let deleteButton = containerElement.query(By.css(".btn-danger"));
    const buttonNativeElem = deleteButton.nativeElement;
    buttonNativeElem.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy.calls.any()).toBeTruthy();
      expect(component.products).toBeNull();
      expect(containerNativeElement.innerText.replace(/\s\s+/g, ' ')).toContain(mockProducts[0].name);
    });
  })
});
