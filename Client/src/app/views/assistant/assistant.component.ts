import { Chatbot } from './../../models/Chatbot';
import { Criterion } from './../../models/Criterion';
import { CoordinatorService } from './../../services/coordinator.service';
import { Client } from './../../models/Client';
import { Criteria } from './../../models/Criteria';
import { Action } from './../../models/Action';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assistant } from 'src/app/models/Assistant';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatOption } from 'src/app/models/ChatOption';

/**
 * @description estructura
 */
interface stdata {
  type: string;
  value: number;
}
//Formato de la informacion recibida por el streaming de datos
interface dataFormat {
  username: string;
  value: number;
  type: string;
  client: string;
}

interface avatarData {
  avatarMessage: string | String;
  image: string;
}
@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css'],
})
export class AssistantComponent implements OnInit, OnDestroy  {
  apiUrl = environment.apiUrl;
  visible = false;
  userData: stdata[] = [];

  //Nota: Borrar
  // client1: Client = {
  //   name: 'client1',
  //   metrics: ['totalcover', 'bmrelevant'],
  //   users: ['participant1', 'participant2'],
  // };

  id: any;
  username: any;
  global: any;
  contexto: any;
  subcontexto: any;
  assistantName: any;
  type: any;
  criteriaList: Criteria[] = [];
  actionList: Action[] = [];
  emptyAction: Action = {
    name: '',
    assistant: '',
    type: '',
    message: {
      message: '',
    },
  };

newCurrentAction: avatarData ={
  image : '',
  avatarMessage: '',
}


  currentAction: Action = {
    name: '',
    assistant: '',
    type: '',
    message: {
      message: '',
    },
  };
  chatbotTemplate: Action | undefined;
  chatbotData: Chatbot = {
    message: '',
    optionList: []
  };

  constructor(
    private sseService: CoordinatorService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) => {
      const { params } = paramMap;
      this.id = params.id;
      this.username = params.username;
      this.global = params.global;
      this.contexto = params.contexto;
      this.subcontexto = params.subcontexto;
      console.log(params);
      this.getAssistant();

      // this.getActions();
      // this.getCriteria();
    });
  }

  /**
   * @function getAssistant
   * @description "Gets the assistant data from the global variable id"
   */
  getAssistant(): void {
    this.http
      .get<Assistant>( environment.neuroneVAUrl +'/assistant/' + this.id)
      .subscribe((res) => {
        this.type = res.type;
        this.assistantName = res.name;
        if (this.type == 'Chatbot') {
          this.getActions();
        } else {
          this.addStudentToClient();
          this.getActions();
          this.getCriteria();
          this.first();
        }
      });
  }

  addStudentToClient(){
    let addstudent = {
      users: [
        this.username
    ]
    }
    console.log(addstudent)
    this.http
      .put(this.apiUrl + '/api/clients/' + this.assistantName , addstudent)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.error('Error al agregar');
        }
      );
  }

  /**
   * @function getActions
   * @description Obtiene las acciones del asistente
   */
  getActions(): void {
    this.http
      .get<Action[]>( environment.neuroneVAUrl +'/action/assistant/' + this.id)
      .subscribe((res) => {
        // console.log(res)
        this.actionList = res;
        console.log(this.actionList);
        if (this.actionList[0].type == 'chatbot') {
          this.chatbotTemplate = this.actionList[0];
          this.addReturnButtons();
        }
      });
  }

  addReturnButtons() {
    if(this.chatbotTemplate == undefined || this.chatbotTemplate.chatbot == undefined){
      return;
    }
    let returnOption: ChatOption = {
      textOption: 'volver',
      replyType: 'text',
      optionsIn: [],
    };
    let layer1 = 0;
    let layer2 = 0;
    let layer3 = 0;
    for (let n of this.chatbotTemplate.chatbot.optionList) {
      layer2 = 0;
      this.chatbotTemplate.chatbot.optionList[layer1].optionsIn.push(
        returnOption
      );
      for (let i of n.optionsIn) {
        if (i.optionsIn.length > 0) {
          this.chatbotTemplate.chatbot.optionList[layer1].optionsIn[
            layer2
          ].optionsIn.push(returnOption);
        } else if (i.textOption != 'volver') {
          this.chatbotTemplate.chatbot.optionList[layer1].optionsIn[
            layer2
          ].optionsIn.push(returnOption);
        }
        layer2++;
      }
      layer1++;
    }
    this.chatbotData = this.chatbotTemplate.chatbot;
    console.log(this.chatbotData);
  }

  /**
   * @function getCriteria
   */
  getCriteria(): void {
    this.http
      .get<Criteria[]>(
        environment.neuroneVAUrl + '/criteria/assistant/' + this.id
      )
      .subscribe((res) => {
        this.criteriaList = res;
      });
  }
  //Funciones de filtrado

  //Agregar el nuevo valor de la metrica a la lista userdata
  /**
   * @function checkData
   * @param recibedData estructura de datos que representa
   */
  checkData(recibedData: dataFormat): void {
    //console.log("Información recibida:", recibedData);
    //console.log("Lista current user: ", this.userData);
    /*------------- */
    let found = 0;
    for (let mt in this.userData) {
      if (this.userData[mt].type == recibedData.type) {
        this.userData[mt].value = recibedData.value;
        found = 1;
        break;
      }
    }
    if (found == 0) {
      let newinfo: stdata = {
        type: recibedData.type,
        value: recibedData.value,
      };
      this.userData.push(newinfo);
    }
  }

  //Revisa que todos los criterios sean verdaderos :0
  /**
   * @function checkCriteria
   */
  checkCriteria() {
    for (let i in this.criteriaList) {
      this.checkingCriteria(this.criteriaList[i], i);
    }
  }

  /**
   * @function checkingCriteria
   * @description Funcion que recorre cada criterion en la criteria, si todos los criterion se cumplen hace al asistente visible
   * @param criteria - Criteria Structure
   * @param i - position of the criterion on criteria
   */
  checkingCriteria(criteria: Criteria, i: any): void {
    let sum = 0;
    console.log('Largo de la lista ', criteria.criteria.length);
    for (let mt in criteria.criteria) {
      console.log('metrica nombre: ', criteria.criteria[mt].metric);
      if (this.checkCriterion(criteria.criteria[mt])) {
        sum++;
      }
    }
    console.log(
      'El resultado total de sum es: ' +
        sum +
        'Y la cantidad de criterios por cumplir son ' +
        criteria.criteria.length
    );
    if (sum == criteria.criteria.length) {
      console.log('El id de la accion es: ' + criteria.action);
      this.getAction(criteria.action);
      this.visible = true;
      console.log('Hacer accion visible');
      console.log('I en checking criteria es :' + i);
      setTimeout(() => {
        this.visible = false;
      }, 45000);
    }
  }

  getAction(id: any) {
    for (let element of this.actionList) {
      if (element._id == id) {
        this.currentAction = element;
        if(this.currentAction.message !=undefined){
          this.newCurrentAction.avatarMessage = this.currentAction.message.message;

        }
      }
    }
  }

  // removeCriteria(){

  // }

  //Verifica que el criterio corresponde a la informacion
  //actual que tiene el usuario (this.userdata)
  //Recibe un criterio y retorna booleano en caso de ser efectiva la condicion del criterio
  /**
   * @function checkCriterion
   * @description
   * @param criterion
   * @returns true if the condition of the criterion
   */
  checkCriterion(criterion: Criterion): boolean {
    //Revisando cada metrica en userData
    for (let mt in this.userData) {
      //Si la metrica de UserData es igual a la del criterio
      console.log(this.userData[mt].type);
      if (this.userData[mt].type == criterion.metric) {
        //Verifica si la condicion es verdadera...
        return this.checkCondition(criterion.condition, criterion.value, mt);
      }
    }
    return false;
  }

  /**
   * @function checkCondition
   * @description funcion que permite verificar que los datos actuales (en userdata) y el valor en criterion cumplen la condicion entregada
   * @param condition string del la condicion (mayor, menor...)
   * @param value valor del criterion
   * @param position posicion del criterio
   * @returns true si los valores coinciden, false si no
   */
  checkCondition(condition: any, value: any, position: any): boolean {
    switch (condition) {
      case '>':
        if (this.userData[position].value > value) {
          return true;
        }
        break;
      case '>=':
        if (this.userData[position].value >= value) {
          return true;
        }
        break;
      case '==':
        if (this.userData[position].value == value) {
          return true;
        }
        break;
      case '<':
        if (this.userData[position].value < value) {
          return true;
        }
        break;
      case '<=':
        if (this.userData[position].value <= value) {
          return true;
        }
        break;
      case '!=':
        if (this.userData[position].value != value) {
          return true;
        }
        break;
    }
    return false;
  }

  //Escuchar client1 a través de SSE
  /**
   * @function first
   */
  first(): void {
    console.log('escuchando');
    this.sseService.stopExchangeUpdates();
    this.sseService.createEventSource('/sse?clients=' + this.assistantName);

    this.sseService.addListener(this.assistantName).subscribe((data: any) => {
      //console.log('client1', data.data);
      let info: dataFormat = JSON.parse(data.data);
      //console.log(info);
      if (info.username == this.username) {
        this.checkData(info);
        this.checkCriteria();
      }
    });
  }

  stop(): void {
    console.log('Delete! ');
    this.http
      .delete(this.apiUrl + '/api/clients/'+ this.assistantName+'/elements')
      .subscribe((res) => console.log(res));
  }

  ngOnDestroy (){
    this.stop();
  }
}
