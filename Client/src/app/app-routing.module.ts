import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssistantComponent } from './views/assistant/assistant.component';
import { CreateComponent } from './views/create/create.component';
import { ListComponent } from './views/list/list.component';

const routes: Routes = [
  {path: 'assistant/:id/:username/:global/:contexto/:subcontexto', component: AssistantComponent},
  {path: 'create', component: CreateComponent}, 
  {path: 'create/:id', component: CreateComponent}, 
  {path: 'list', component: ListComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
