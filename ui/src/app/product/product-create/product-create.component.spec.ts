import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductCreateComponent} from './product-create.component';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from "@angular/core";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AppService} from "../../services/app.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {of} from "rxjs";
import {JavaScriptEmitter} from "@angular/compiler/src/output/js_emitter";

describe('ProductCreateComponent', () => {
  let component: ProductCreateComponent;
  let fixture: ComponentFixture<ProductCreateComponent>;
  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();
  let http: HttpClient;
  let appService: AppService;
  let element: DebugElement;
  let mockProduct: any;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCreateComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [
        // reference the new instance of formBuilder from above
        {provide: FormBuilder, useValue: formBuilder},
        HttpClient,
        AppService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpClient);
    appService = TestBed.get(AppService);
    element = fixture.debugElement;

    mockProduct = {id: 1, name: "Hello world", category: "Ruby", code: "puts 'Hello'", price: 1234};

    spy = spyOn(appService, 'createProduct').and.returnValue(of(mockProduct));


    // pass in the form dynamically
    component.initProductForm(undefined);
    fixture.autoDetectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have productForm valid after setting value for name', () => {
    expect(component.productForm.valid).toBeFalsy();
    component.productForm.get('name').setValue('Some Value');
    expect(component.productForm.valid).toBeTruthy();
  });

  it('should initialize details key value pair by default', () => {
    expect(component.productForm.get('details').length).toBeGreaterThan(0);
  });

  it('should add more details key value pair id clicked on + button', () => {

    const buttonElement = element.query(By.css('.btn-success'));
    const buttonNativeElem = buttonElement.nativeElement;
    buttonNativeElem.click();

    fixture.detectChanges();

    expect(component.productForm.get('details').length).toBeGreaterThan(1);
  });

  it('should remove more details key value pair id clicked on remove button', () => {

    const buttonElement = element.query(By.css('.btn-danger'));
    const buttonNativeElem = buttonElement.nativeElement;
    buttonNativeElem.click();

    fixture.detectChanges();

    expect(component.productForm.get('details').length).toBe(0);
  });

  it('should successfully submit the new product on clicking the Save button', async () => {

    expect(component.productForm.valid).toBeFalsy();
    component.productForm.get('name').setValue('Some Value');
    fixture.detectChanges();
    expect(component.productForm.valid).toBeTruthy();

    let saveButton = element.query(By.css(".btn-primary"));
    saveButton.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy.calls.any()).toBeTruthy();
    });
  })
});
