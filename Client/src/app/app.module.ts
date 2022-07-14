import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatRadioModule} from '@angular/material/radio'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';    
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider'; 


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { CreateActionComponent } from './components/create-action/create-action.component';
import { CreateCriteriaComponent } from './components/create-criteria/create-criteria.component';
import { AssistantComponent } from './views/assistant/assistant.component';
import { CreateComponent } from './views/create/create.component';
import { ListComponent } from './views/list/list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AvatarComponent,
    ChatbotComponent,
    CreateActionComponent,
    CreateCriteriaComponent,
    AssistantComponent,
    CreateComponent,
    ListComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDividerModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
