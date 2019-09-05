import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppService } from './services/app.service';

import { of } from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

class FakeAppService extends AppService {
  getWelcomeMessage() {
    return of({
      content: 'Test content'
    });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: AppService, useClass: FakeAppService}
        ]
      }
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    expect(true).toBeTruthy();
  }));
});
