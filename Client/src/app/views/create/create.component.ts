import { Message } from './../../models/Message';
import { Action } from './../../models/Action';
import { ChatOption } from './../../models/ChatOption';
import { Chatbot } from './../../models/Chatbot';
import { Criteria } from './../../models/Criteria';
import { Criterion } from './../../models/Criterion';
import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Metrics } from 'src/app/models/Metrics';
import { ActivatedRoute } from '@angular/router';
import { Assistant } from 'src/app/models/Assistant';

interface Condition {
  word: string;
  symbol: string;
}

interface CreateCriteriaData {
  assistantId: string;
  selectedMetrics: Metrics[];
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  apiUrl = environment.apiUrl;
  currentCriteriaId: any;
  currentActionId: any;
  actionName: string = '';
  name: String = '';
  description: String = '';
  type: String = '';
  criteriaList: Criteria[] = [];
  actionList: Action[] = [];
  //Dropdown data
  conditionList: Condition[] = [
    { word: 'Mayor', symbol: '>' },
    { word: 'Menor', symbol: '<' },
    { word: 'Igual', symbol: '==' },
    { word: 'Mayor o igual', symbol: '>=' },
    { word: 'Menor o igual', symbol: '<=' },
    { word: 'Distinto de', symbol: '!=' },
  ];

  criteriaName: string = '';
  criteria: Criterion[] = [];
  criteriaListSave: Criteria[] = [];
  metrics: Metrics[] = [];
  assistantID: any = '';

  replyType: any = '';

  chatbotMessage: string = '';
  chatbotOptionList: ChatOption[] = [];

  selectedMetricsList: string[] = [];

  criteriaData: CreateCriteriaData = {
    assistantId: '',
    selectedMetrics: [],
  };

  selectedMetrics: Metrics[] = [];
  selectedMetricsEmpty = true;
  createAssistantCheckMetrics = false;
  createAssistantTypeNotSelected = false;
  currentDetailedMetric: Metrics = {
    name: '',
    alias: '',
    descriptions: {
      es: '',
      en: '',
    },
    dataType: '',
    max: 0,
    interval: 0,
  };
  currentMetricCriteria: Metrics = {
    name: '',
    alias: '',
    descriptions: {
      es: '',
      en: '',
    },
    dataType: '',
    max: 0,
    interval: 0,
  };
  selectedType: string = '';
  step = 0;

  assistantCreated = false;
  assistantCreationFailed = false;
  disableCreateButton = false;
  clientName: string = '';

  obtainedMetrics: any[] = [];

  agregados: any[] = [];
  eliminados: any[] = [];
  /* -------- Constructor -------- */
  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  /* -------- Init -------- */

  criteriaAndAction: boolean = false;
  ngOnInit(): void {
    this.getMetrics();
    this.route.paramMap.subscribe((paramMap: any) => {
      const { params } = paramMap;
      if (params.id != undefined) {
        // this.assistantID = params.id;
        this.getAssistant(params.id);
        console.log(params.id);
      }
    });
  }

  getAssistant(id: any) {
    this.http
      .get<Assistant>('https://va.neurone.info/api/assistant/' + id)
      .subscribe(
        (res) => {
          console.log(res);

          this.assistantID = res._id;
          this.criteriaData.assistantId = this.assistantID;
          this.obtainedMetrics = res.metrics;
          this.setLoadedMetrics(this.obtainedMetrics);
          let type = res.type;
          this.type = type;
          this.name = res.name;
          this.description = res.description;
          this.reload();
        },
        (error) => {
          console.error('Error al obtener asistentes');
        }
      );
  }

  setLoadedMetrics(loadedMetrics: string[]) {
    if (loadedMetrics.length > 0) {
      for (let lMetric of loadedMetrics) {
        for (let metric of this.metrics) {
          if (lMetric == metric.name) {
            this.criteriaData.selectedMetrics.push(metric);
            this.selectedMetrics.push(metric);
            this.selectedMetricsList.push(String(metric.name));
          }
        }
      }
    }
  }
  /**
   * @function getActions
   */
  getActions(): void {
    this.http
      .get<Action[]>(
        environment.neuroneVAUrl + '/action/assistant/' + this.assistantID
      )
      .subscribe((res) => (this.actionList = res));
  }

  /**
   * @function getCriteria
   */
  getCriteria(): void {
    this.http
      .get<Criteria[]>(
        environment.neuroneVAUrl + '/criteria/assistant/' + this.assistantID
      )
      .subscribe((res) => (this.criteriaList = res));
  }

  /* ----- ------- */
  setStep(index: number): void {
    if (this.type != '') {
      if (this.type == 'Avatar') {
        alert('avatar!');
      } else {
      }
    }
    this.step = index;
  }

  nextStep(): void {
    if (this.type != '') {
      if (this.type == 'Avatar') {
        alert('avatar!');
      } else {
      }
    }
    this.step++;
  }

  prevStep(): void {
    if (this.type != '') {
      if (this.type == 'Avatar') {
        alert('avatar!');
      }
    }
    this.step--;
  }
  /* -------- Metrics -------- */

  //Get metrics from the server
  /**
   * @function getMetrics
   * @description get all the metrics from neuroneAM server api
   */
  getMetrics(): void {
    this.http.get<Metrics[]>(this.apiUrl + '/api/metrics').subscribe(
      (res) => {
        this.metrics = res;
      },
      (err) => console.error(err)
    );
  }
  //Metrics selection: Adds a metric to a list
  /**
   * @function selectMetric
   * @description adds a metric to a list if the name was not used before
   * @param selectedMetric
   */
  selectMetric(selectedMetric: Metrics): void {
    if (selectedMetric.name != '') {
      let rep = 0;
      for (let current in this.selectedMetricsList) {
        if (selectedMetric.name == this.selectedMetricsList[current]) {
          rep = 1;
        }
      }
      if (rep == 0) {
        this.criteriaData.selectedMetrics.push(selectedMetric);
        this.selectedMetrics.push(selectedMetric);
        this.selectedMetricsList.push(String(selectedMetric.name));
      }
    }
    this.checkMetrics();
  }

  checkMetrics() {
    if (this.createAssistantCheckMetrics) {
      if (this.selectedMetrics.length == 0) {
        this.selectedMetricsEmpty = true;
      } else {
        this.selectedMetricsEmpty = false;
      }
    }
  }
  /* Delete Metric (from the list) */
  /**
   * @function deleteMetric
   * @param i position of the metric to delete
   */
  deleteMetric(i: number) {
    this.selectedMetrics.splice(i, 1);
    this.selectedMetricsList.splice(i, 1);
  }

  //Creation of Assistant + Client
  /**
   * @function createAV
   * @param object objeto con los datos del asistente
   */
  createAV(object: any) {
    console.log('Create Av');
    console.log(object);
    this.clientName = object.name;
    let AssistantData = {
      name: object.name,
      description: object.description,
      type: object.type,
      metrics: this.selectedMetricsList,
    };

    let newClient = {
      name: object.name,
      metrics: this.selectedMetricsList,
      users: [],
    };
    if (object.type == 'Avatar') {
      if (this.assistantID == '') {
        this.createClient(newClient);
      } else {
        this.saveNewMetrics();
        this.deleteMetrics();
      }
      console.log('avi~~');
    }
    if (this.assistantID == '') {
      if (this.validateCreation(AssistantData)) {
        this.disableCreateButton = true;
        this.createAssistantDB(AssistantData);
      }
    } else {
      this.editAssistantDB(AssistantData);
    }
    //this.createClient(newClient);
  }

  saveNewMetrics() {
    let contador = 0;
    this.agregados = [];
    for (let metric in this.selectedMetricsList) {
      for (let oldMetric in this.obtainedMetrics) {
        if (
          this.selectedMetricsList[metric] == this.obtainedMetrics[oldMetric]
        ) {
          //console.log("Iguales 1")
          // agregados.push(this.selectedMetricsList[metric])
          contador++;
        }
      }
      if (contador == 0) {
        this.agregados.push(this.selectedMetricsList[metric]); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        console.log(this.selectedMetricsList[metric])
      } else {
        contador = 0;
      }
    }
    console.log(' por Agregar ');
    let body = {
      metrics: this.agregados,
    };
    if (this.agregados.length > 0) {
      this.editClient(body);
    }
  }

  deleteMetrics() {
    this.eliminados = [];
    let contador2 = 0;
    for (let memetric in this.obtainedMetrics) {
      for (let uwu in this.selectedMetricsList) {
        if (this.selectedMetricsList[uwu] == this.obtainedMetrics[memetric]) {
          // console.log("Iguales 2")
          //listaIguales.push(this.selectedMetricsList[uwu])
          contador2++;
        }
      }
      if (contador2 == 0) {
        this.eliminados.push(this.obtainedMetrics[memetric]);
        // console.log(this.obtainedMetrics[memetric])
      } else {
        contador2 = 0;
      }
    }
    console.log(' por eliminar ');
    let body = {
      metrics: this.eliminados,
    };
    if (this.eliminados.length > 0) {
      this.deleteMetricsClient(body);
    }

  }

  getAllClients() {
    this.http.get<any>(this.apiUrl + '/api/clients').subscribe(
      (res) => { },
      (err) => { }
    );
  }

  createClient(client: any) {
    this.http.post(this.apiUrl + '/api/clients', client).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error('Error al crear Cliente');
      }
    );
  };

  editClient(client: any) {
    console.log(this.clientName);
    console.log(client);
    this.http
      .put(this.apiUrl + '/api/clients/' + this.clientName, client)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.error('Error al editar asistentes');
        }
      );
  }

  deleteMetricsClient(client: any) {
    console.log(this.clientName);
    console.log(client);
    this.http
      .put(this.apiUrl + '/api/clients/' + this.clientName + '/elements', client)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.error('Error al editar asistentes');
        }
      );
  }

  validateCreation(object: any) {
    if (
      this.validateTypeAssistant(object) &&
      this.validateDescriptionAssistant(object) &&
      this.validateNameAssistant(object)
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateNameAssistant(object: any) {
    if (object.name == '') {
      return false;
    } else {
      return true;
    }
  }

  validateDescriptionAssistant(object: any) {
    if (object.description == '') {
      return false;
    } else {
      return true;
    }
  }

  validateTypeAssistant(object: any) {
    if (object.type == '' || object.type == undefined) {
      this.createAssistantTypeNotSelected = true;
      return false;
    } else {
      this.createAssistantTypeNotSelected = false;
      if (object.type == 'Chatbot') {
        this.createAssistantCheckMetrics = false;
        return true;
      } else {
        return this.validateAssistantMetrics(object);
      }
    }
  }

  selectedTypeRadio() {
    this.createAssistantTypeNotSelected = false;
  }

  validateAssistantMetrics(object: any) {
    if (object.metrics.length == 0) {
      this.createAssistantCheckMetrics = true;
      this.checkMetrics();
      return false;
    } else {
      return true;
    }
  }
  //Create Assistant
  /**
   * @function createAssistantDB
   * @param json -Object to save in the database to create an assistant
   */
  createAssistantDB(json: Object): void {
    this.http.post(environment.neuroneVAUrl + '/assistant', json).subscribe(
      (res) => {
        console.log(res);
        console.log('Save Av DB');
        this.getCreatedID(res);
        this.assistantCreated = true;
        this.disableCreateButton = true;
        setTimeout(() => {
          this.assistantCreated = false;
        }, 5000);
      },
      (err) => {
        console.error(err);
        this.assistantCreationFailed = true;
        setTimeout(() => {
          this.assistantCreationFailed = false;
        }, 5000);
      }
    );
  }

  editAssistantDB(json: Object): void {
    this.http
      .put(environment.neuroneVAUrl + '/assistant/' + this.assistantID, json)
      .subscribe((res) => {
        console.log(res);
      });
  }
  //getCreatedId
  /**
   * @function getCreatedID
   * @param object server Response
   */
  getCreatedID(object: any): void {
    this.criteriaData.assistantId = object._id;
    this.assistantID = object._id;
    //this.selectedType = object.type;
  }

  reload(): void {
    this.getActions();
    this.getCriteria();
  }

  addCriteriaToAction(): void {

    let actionIDBody = {
      action: this.currentActionId,
    };

    this.http
      .put(
        'https://va.neurone.info/api/criteria/' + this.currentCriteriaId,
        actionIDBody
      )
      .subscribe((res) => {
        console.log(res);
        this.criteriaAndAction = true;
        setTimeout(() => {
          this.criteriaAndAction = false;
        }, 5000);
      });
  }

  /*
  //Add criteria
  criterio(data: any) {
    
    const newCrit: Criterion = { metric: '', condition: '', value: 0 };
    newCrit.metric = data.metric.name;
    newCrit.condition = data.condition;
    newCrit.value = data.value;

    let found = 0;
    for (let mt in this.criteria) {
      if (this.criteria[mt].metric == data.metric.name) {
        found = 1;
        break;
      }
    }
    if (found == 0) {
      this.criteria.push(newCrit);
    }
  }
   //Save criteria
   saveCriteria() {
    if (this.criteria.length > 0) { //If the list criteria have at least one element
     const critList: Criteria = {
        name: this.criteriaName,
        assistant: this.assistantID,
        criteria: this.criteria,
      };
      
      this.createCriteria(critList);
      //this.http.post("http://localhost:3000/api/criteria", critList).subscribe(res=>console.log(res))

      this.criteriaListSave.push(critList);
      console.log(this.criteriaListSave);
      this.criteria = [];
      this.criteriaName = '';
      //this.getCriteriaList();
    }
  }*/

  /* Delete criteria */
  /*
  deleteCriteria(i: number) {
    this.criteria.splice(i, 1);
  }

  createCriteria(json: Criteria) {
    console.log('Save Criteria DB');
    this.http
      .post('http://va.neurone.info/api/criteria', json)
      .subscribe((res) => console.log(res));
  }
  /* ---- Chatbot ---- */

  /*
  saveChatbotDB(json: Action) {
    console.log('Save action DB');
    this.http
      .post('http://va.neurone.info/api/chatbot', json)
      .subscribe((res) => console.log(res));
  }

  saveCBO(data: any) {
    console.log('value:', data);
    if(data.replyType == "texto"){
      const Option: ChatOption = {
        textOption: data.textOption,
        replyType: data.replyType,
        textReply: data.textReply,
      };
      this.chatbotOptionList.push(Option);
    }
    if(data.replyType == "imagen"){
      const Option: ChatOption = {
        textOption: data.textOption,
        replyType: data.replyType,
        //filename: data.filename,
      };
      this.chatbotOptionList.push(Option);
    }
  }
  SaveChatbot():Chatbot {
    const saveChatbot: Chatbot = {
      //assistant: this.assistantID,
      message: this.chatbotMessage,
      optionList: this.chatbotOptionList,
    };
    return saveChatbot;
  }

  SaveAction(type:string){
    if(type =="chatbot"){
      let saveAction: Action = {
        name: this.actionName,
        type: "chatbot",
        assistant: this.assistantID,
        chatbot: this.SaveChatbot()
      }
      console.log(saveAction);
      this.saveChatbotDB(saveAction);
    }
    else if(type == "avatar"){
      let theMessage: Message = {
        message:""
        //Imagen avatar~
      }
      let saveAction: Action = {
        name: this.actionName,
        type: "avatar",
        assistant: this.assistantID,
        message: theMessage,
      }
      console.log(saveAction);
    }
  }
*/
}
