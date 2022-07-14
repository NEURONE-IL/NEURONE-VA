import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AssistantService } from './services/assistant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Client';
  images:any;
  imageName: string = '';
  constructor(public translate: TranslateService, private http: HttpClient, private assistantService: AssistantService) {
    translate.addLangs(['es','en'])
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('es');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('es');
  }

}
