import { Action } from './../../models/Action';
import { Criteria } from './../../models/Criteria';
import { Criterion } from './../../models/Criterion';
import { Client } from './../../models/Client';
import { CoordinatorService } from './../../services/coordinator.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Assistant } from 'src/app/models/Assistant';
import { Router } from '@angular/router';

interface stdata {
  type: string;
  value: number;
}

interface dataFormat {
  username: string;
  value: number;
  type: string;
  client: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  currentAssistant: Assistant = {
    name: '',
    description: '',
    type: '',
    metrics: [],
  };

  emptyAssistant: Assistant = {
    name: '',
    description: '',
    type: '',
    metrics: [],
  };
  mdalEliminar = false;
  avatarText: string = '';
  avatarText2: string = 'Hello! <b> Hola </b>';

  apiUrl = environment.apiUrl;
  visible = false;
  userData: stdata[] = [];

  client1: Client = {
    name: 'client1',
    metrics: ['totalcover', 'bmrelevant'],
    users: ['participant1', 'participant2'],
  };

  assistantList: Assistant[] = [];

  actionList:Action[] = [];
  criteriaList: Criteria[] = [];
  constructor(
    private sseService: CoordinatorService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('init');
    this.getAllAssistants();
    // LLamadas al servicio para crear clientes
  }

  alertCall() {
    if (this.currentAssistant.type == 'Chatbot') {
      this.getActions(this.currentAssistant._id);
      //get action
    }
    if (this.currentAssistant.type == 'Avatar') {
      this.getActions(this.currentAssistant._id);
      this.getCriteriaList(this.currentAssistant._id);
      //get Action
      //get Criteria list
    }
    // alert(this.currentAssistant._id);
  }

  deleteAssistant(id: string | String | undefined) {
    this.http
      .delete('https://va.neurone.info/api/assistant/' + id)
      .subscribe((res) => {
        console.log('asistente eliminado');
        this.getAllAssistants();
        this.currentAssistant = this.emptyAssistant;
      });
  }

  deleteAssistantAction(id: string | String | undefined) {
    this.http
      .delete('https://va.neurone.info/api/action/assistant/' + id)
      .subscribe((res) => {
        console.log('Acciones eliminadas');
        this.actionList = [];
      });
  }

  deleteAssistantCriteria(id: string | String | undefined) {
    this.http
      .delete('https://va.neurone.info/api/criteria/assistant/' + id)
      .subscribe((res) => {
        console.log('Criterios eliminados');
        this.criteriaList = [];
      });
  }

  getActions(id: string | String | undefined) {
    this.http
      .get<Action[]>('https://va.neurone.info/api/action/assistant/' + id)
      .subscribe((res) => {
        console.log(res);
        this.actionList = res;
      });
  }

  getCriteriaList(id: string | String | undefined) {
    this.http
      .get<Criteria[]>('https://va.neurone.info/api/criteria/assistant/' + id)
      .subscribe((res) => {
        console.log(res);
        this.criteriaList = res;
      });
  }

  delete() {
    // alert('Vas a borrar el siguiente avatar: ' + this.currentAssistant._id);
    this.deleteAssistant(this.currentAssistant._id);
    if(this.actionList.length >0){
      for(let action of this.actionList){
        this.deleteAction(action._id);
      }
    }
    // this.deleteAssistantAction(this.currentAssistant._id);
    this.deleteAssistantCriteria(this.currentAssistant._id);
  }

  redirect() {
    if (this.currentAssistant._id != '' && this.currentAssistant._id != undefined) {
      this.router.navigate(['create/' + this.currentAssistant._id]);
    }
    else{
      this.router.navigate(['create/']);
    }
  }

  getAllAssistants() {
    this.http
      .get<Assistant[]>('https://va.neurone.info/api/assistant/')
      .subscribe(
        (res) => {
          this.assistantList = res;
        },
        (error) => {
          console.error('Error al obtener asistentes');
        }
      );
  }

  //Llamada al servicio para crear el cliente
  createClient(json: Object) {
    console.log('create ', json);
    this.http
      .post(this.apiUrl + '/api/clients', json)
      .subscribe((res) => console.log(res));
  }

  deleteAction(actionId:any){
    this.http.delete<any>("https://va.neurone.info/api/action/" + actionId).subscribe(
      (res) =>{
        console.log(res);
        this.getActions(this.currentAssistant._id);
      }
    )
  }

  deleteCriteria(criteriaId:any){
    this.http.delete<any>("https://va.neurone.info/api/criteria/" + criteriaId).subscribe(
      (res) =>{
        console.log(res);
        this.deleteImages(res.ToDelete)
        this.getCriteriaList(this.currentAssistant._id);
      }
    )
  }

  deleteImages(imageList: any){
    if(imageList.length > 0){
      for(let image of imageList){
        console.log(image)
      }
    }
  }

}
