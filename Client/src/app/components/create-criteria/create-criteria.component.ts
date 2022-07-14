import { environment } from 'src/environments/environment';
import { Criteria } from './../../models/Criteria';
import { Criterion } from './../../models/Criterion';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Metrics } from 'src/app/models/Metrics';
import { HttpClient } from '@angular/common/http';

interface Condition {
  word: string;
  symbol: string;
}

interface CreateCriteriaData {
  assistantId: string;
  selectedMetrics: Metrics[];
}
@Component({
  selector: 'app-create-criteria',
  templateUrl: './create-criteria.component.html',
  styleUrls: ['./create-criteria.component.css'],
})
export class CreateCriteriaComponent implements OnInit {
  /* Input data from the parent component CreateComponent  */
  @Input() item: CreateCriteriaData = {
    assistantId: '',
    selectedMetrics: []
  }

  currentCriteriaEdit: Criteria = {
    name: "",
    assistant: "",
    criteria: []
  };

  currentCriteriaClear: Criteria = {
    name: "",
    assistant: "",
    criteria: []
  };

  /* Data */
  criteria: Criterion[] = [];
  criteriaList: Criteria[] = [];

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
  conditionList: Condition[] = [
    { word: 'Mayor', symbol: '>' },
    { word: 'Menor', symbol: '<' },
    { word: 'Igual', symbol: '==' },
    { word: 'Mayor o igual', symbol: '>=' },
    { word: 'Menor o igual', symbol: '<=' },
    { word: 'Distinto de', symbol: '!=' },
  ];

  criteriaName: string = '';
  criteriaNameIsEmpty: boolean = false;
  isEditingCriteria: boolean = false;

  newCriterionForm = new FormGroup({
    metric: new FormControl('', [Validators.required]),
    condition: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required]),
  });

  selectedMetricsEmpty: boolean = false;
  selectedConditionEmpty: boolean = false;
  criteriaIsEmpty: boolean = false;

  criteriaCreated: boolean = false;
  criteriaCreatedFailed: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCriteriaList(this.item.assistantId);
  }

  changeCriteriaEdit() {
    if (this.currentCriteriaEdit.name == undefined) {
      this.criteria = [];
      this.isEditingCriteria = false;
    }
    else {
      this.isEditingCriteria = true;
      this.criteria = [];
      this.criteriaName = this.currentCriteriaEdit.name;
      for (let elem of this.currentCriteriaEdit.criteria) {

        this.criteria.push(elem);
        console.log(elem.metric);
      }

      // this.criteria
      console.log(this.currentCriteriaEdit)
    }
  }

  getCriteriaList(id : any) {
    this.http
      .get<Criteria[]>('https://va.neurone.info/api/criteria/assistant/' + id)
      .subscribe((res) => {
        console.log(res);
        this.criteriaList = res;
      });
  }

  /* Criterion */
  //Checks if the metric
  uniqueCriteriaCheck(): boolean {
    let found = 0;
    for (let i in this.criteria) {
      if (this.criteria[i].metric == this.newCriterionForm.value.metric) {
        found = 1;
        break;
      }
    }
    if (found == 0) {
      return true; //Return true if the metric is not in use
    } else {
      return false; //Return false if the metric is on another criterion
    }
  }

  criterionPosition() : number {
    for (let i in this.criteria) {
      if (this.criteria[i].metric == this.newCriterionForm.value.metric) {
        return Number(i);
      }
    }
    return -1;
  }

  clearCriterion() {
    this.newCriterionForm.setValue({
      metric: '',
      condition: '',
      value: '',
    });
  }

  addCriterion() {
    if (
      this.newCriterionForm.valid && (this.newCriterionForm.value.metric != '') //this.newCriterionForm.value.metric.name != '' ||
    ) {
      if(this.newCriterionForm.value.metric != undefined && this.newCriterionForm.value.condition != undefined && this.newCriterionForm.value.value != undefined){
        let newCriterion: Criterion = {
          metric: this.newCriterionForm.value.metric,
          condition: this.newCriterionForm.value.condition,
          value: Number(this.newCriterionForm.value.value),
        };
        if (this.uniqueCriteriaCheck()) {
          this.criteria.push(newCriterion);
        } else {
          this.criteria[this.criterionPosition()] = newCriterion;
        }
        this.clearCriterion();
      }
      
    } else {
      this.checkMetricSelected();
      this.checkConditionSelected();
    }
    this.checkCriteriaList();
  }

  checkMetricSelected() {
    if(this.newCriterionForm.value.metric != undefined){
      if (this.newCriterionForm.value.metric == '') {// this.newCriterionForm.value.metric.name == '' || <<<
      this.selectedMetricsEmpty = true;
    } else {
      this.selectedMetricsEmpty = false;
    }
    }
    
  }

  checkConditionSelected() {
    if (this.newCriterionForm.value.condition == '') {
      this.selectedConditionEmpty = true;
    } else {
      this.selectedConditionEmpty = false;
    }
  }

  /* Delete criterion */
  deleteCriterion(i: number) {
    this.criteria.splice(i, 1);
  }

  editCriterion(i: number) {
    this.newCriterionForm.value.metric = this.criteria[i].metric;
    this.newCriterionForm.value.condition = this.criteria[i].condition;
    this.newCriterionForm.value.value = String(this.criteria[i].value);
  }

  /* Criteria */
  saveCriteria() {
    if (this.checkCriteria()) {
      //If the list criteria have at least one element
      const critList: Criteria = {
        name: this.criteriaName,
        assistant: this.item.assistantId,
        criteria: this.criteria,
      };
      if (this.isEditingCriteria == false) {
        this.createCriteria(critList);

      }
      else {
        console.log("editar!");
        this.isEditingCriteria = false;
        this.editCriteria(critList);
      }
      this.criteria = [];
      this.criteriaName = '';
      //Enviar cargar :0?
    }

  }

  checkCriteria() {
    let criteriaName = this.checkCriteriaName();
    let criteriaList = this.checkCriteriaList();
    if (criteriaList && criteriaName) {
      return true;
    } else {
      return false;
    }
  }

  checkCriteriaName() {
    if (this.criteriaName == '') {
      this.criteriaNameIsEmpty = true;
      return false;
    } else {
      this.criteriaNameIsEmpty = false;
      return true;
    }
  }

  checkCriteriaList() {
    if (this.criteria.length > 0) {
      this.criteriaIsEmpty = false;
      return true;
    } else {
      this.criteriaIsEmpty = true;
      return false;
    }
  }

  //Save Criteria on DB
  createCriteria(json: Criteria) {
    console.log('Save Criteria DB');
    this.http.post(environment.neuroneVAUrl + '/criteria', json).subscribe(
      (res) => {
        console.log(res);
        this.criteriaCreated = true;
        setTimeout(() => {
          this.criteriaCreated = false;
        }, 5000);
        this.getCriteriaList(this.item.assistantId);
      },
      (err) => {
        this.criteriaCreatedFailed = true;
        setTimeout(() => {
          this.criteriaCreatedFailed = false;
        }, 5000);
        console.log(err);
        this.getCriteriaList(this.item.assistantId);
      }
    );
  }

  editCriteria(json: Criteria) {
    console.log('Save Criteria DB - edit');
    this.http.put<any>(environment.neuroneVAUrl + '/criteria/' + this.currentCriteriaEdit._id, json).subscribe(
      (res) => {
        console.log(res);
        this.criteriaCreated = true;
        setTimeout(() => {
          this.criteriaCreated = false;
        }, 5000);
        this.getCriteriaList(this.item.assistantId);
      },
      (err) => {
        this.criteriaCreatedFailed = true;
        setTimeout(() => {
          this.criteriaCreatedFailed = false;
        }, 5000);
        console.log(err);
        this.getCriteriaList(this.item.assistantId);
      }
    );
  }

}
