import { ChatOption } from './../../models/ChatOption';
import { Chatbot } from './../../models/Chatbot';
import { Component, Input, OnInit } from '@angular/core';

interface visibleMatrix {
  isVisible: boolean;
  optionList: visibleMatrix[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  @Input() chatbotData!: Chatbot;
  visible: boolean = true;

  chatbotDataLoaded: boolean = false;
  visibleMatrix: visibleMatrix[] = [];
  visibleMatrixOptions: visibleMatrix[] = [];
  constructor() {}

  ngOnInit(): void {
    
   // this.addReturnButtons();
    console.log(this.chatbotData);
    this.createVisibleMatrix();
  }

  hide() {
    this.visible = !this.visible;
  }

  clearOptionsLayer1(){
    for(let index = 0; index < this.visibleMatrix.length; index++){
      if(this.visibleMatrix[index].isVisible = true){
        this.visibleMatrix[index].isVisible = false;
      }
    }
  }

  hideOptionsLayer1(i: number){
    for(let index = 0; index < this.visibleMatrixOptions.length; index++){
      if(this.visibleMatrixOptions[index].isVisible = true){
        this.visibleMatrixOptions[index].isVisible = false;
      }
    }
    this.visibleMatrixOptions[i].isVisible = !this.visibleMatrixOptions[i].isVisible;
  }

  showOptionsLayer1(i: number, reply: string) {
    this.clearOptionsLayer1();
    this.visibleMatrix[i].isVisible = !this.visibleMatrix[i].isVisible;
    this.hideOptionsLayer1(i);
  }

  clearOptionsLayer2(){
    let layer1 = 0;
    for(let i of this.visibleMatrix){
      for(let index = 0; index < i.optionList.length; index++){
        if(this.visibleMatrix[layer1].optionList[index].isVisible = true){
          this.visibleMatrix[layer1].optionList[index].isVisible = false;
        }
      }
      layer1++;
    }
  }

  showAgainOptionsLayer2(){
    let layer1 = 0;
    for(let i of this.visibleMatrixOptions){
      for(let index = 0; index < i.optionList.length; index++){
        this.visibleMatrixOptions[layer1].optionList[index].isVisible = true;
      }
      layer1++;
    }
  }

  hideOptionsLayer2(a:number, b:number){
    let layer1 = 0;
    for(let i of this.visibleMatrixOptions){
      for(let index = 0; index < i.optionList.length; index++){
        if(this.visibleMatrixOptions[layer1].optionList[index].isVisible = true){
          this.visibleMatrixOptions[layer1].optionList[index].isVisible = false;
        }
      }
      layer1++;
    }
    this.visibleMatrixOptions[a].optionList[b].isVisible =
      !this.visibleMatrixOptions[a].optionList[b].isVisible;
  }

  showOptionsLayer2(i: number, j: number, reply: string ) {
    console.log(reply);
    
    this.clearOptionsLayer2();
    if(reply != 'volver'){
      this.hideOptionsLayer2(i,j);
      this.visibleMatrix[i].optionList[j].isVisible =
      !this.visibleMatrix[i].optionList[j].isVisible;
    }
    else{
      this.clearOptionsLayer1();
      this.setInicialVisibleMatrixOptions();
    }
  }

  showOptionsLayer3(i: number, j: number, k: number, reply: string) {
    console.log(reply);
    let layer1 = 0;
    let layer2 = 0;
    for(let i of this.visibleMatrix){
      for(let j of i.optionList){
        for(let index = 0; index< j.optionList.length; index++){
          if(this.visibleMatrix[layer1].optionList[layer2].optionList[index].isVisible = true){
            this.visibleMatrix[layer1].optionList[layer2].optionList[index].isVisible  = false;
          }
        }
      }
      layer1++;
    }
    if(reply != 'volver'){
      this.visibleMatrix[i].optionList[j].optionList[k].isVisible =
      !this.visibleMatrix[i].optionList[j].optionList[k].isVisible;
    }
    else{
      this.clearOptionsLayer2();
      this.showAgainOptionsLayer2();
    }    
  }

  createVisibleMatrix() {
    let layer1 = 0;
    for (let n of this.chatbotData.optionList) {
      this.visibleMatrix.push({ isVisible: false, optionList: [] });
      this.visibleMatrixOptions.push({ isVisible: true, optionList: [] });
    }
    let layer2 = 0;
    let layer3 = 0;
    for (let i of this.chatbotData.optionList) {
      layer2 = 0;
      for (let index = 0; index < i.optionsIn.length; index++) {
        // console.log(i, " i tiene una lista de largo", i.optionsIn.length )
        this.visibleMatrix[layer1].optionList.push({
          isVisible: false,
          optionList: [],
        });
        this.visibleMatrixOptions[layer1].optionList.push({
          isVisible: true,
          optionList: [],
        });
      }
      //  if(i.optionsIn.length > layer2){
      //   layer2 = i.optionsIn.length;
      //  }
      for (let j of i.optionsIn) {
        for (let jndex = 0; jndex < j.optionsIn.length; jndex++) {
          this.visibleMatrix[layer1].optionList[layer2].optionList.push({
            isVisible: false,
            optionList: [],
          });
          this.visibleMatrixOptions[layer1].optionList[layer2].optionList.push({
            isVisible: true,
            optionList: [],
          });
        }

        if (j.optionsIn.length > layer3) {
          layer3 = j.optionsIn.length;
        }
        layer2++;
      }
      layer1++;
    }
    console.log(layer1 + ' ' + layer2 + ' ' + layer3);
    this.setInicialVisibleMatrixOptions();
    this.chatbotDataLoaded = true;
  }

  setInicialVisibleMatrixOptions(){
    for(let index = 0; index < this.visibleMatrixOptions.length; index++){
      this.visibleMatrixOptions[index].isVisible = true;
    }
    console.log(this.visibleMatrix);
    console.log(this.visibleMatrixOptions);
    this.chatbotDataLoaded = true;
  }

  OptionsVisible(){
    this.chatbotDataLoaded = true;
  }
}
