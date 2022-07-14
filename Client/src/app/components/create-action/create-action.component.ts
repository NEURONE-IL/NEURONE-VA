import { async } from '@angular/core/testing';
import { Chatbot } from './../../models/Chatbot';
import { Message } from './../../models/Message';
import { Action } from './../../models/Action';
import { ChatOption } from './../../models/ChatOption';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AssistantService } from 'src/app/services/assistant.service';

@Component({
  selector: 'app-create-action',
  templateUrl: './create-action.component.html',
  styleUrls: ['./create-action.component.css'],
})
export class CreateActionComponent implements OnInit {
  //Action
  @Input() assistantId: any;
  @Input() actionType: any;
  images:any = undefined;

  replyType: any;
  imageName: String | string |undefined;
  actionName: String = '';
  actionNameIsEmpty: boolean = false;
  actionAvatarMessageIsEmpty: boolean = false;
  //Chatbot
  chatbotMessage: string = '';
  chatbotOptionList: ChatOption[] = [];
  chatbotImagePreview: String | string = '';
  chatbotImagePreviewLoaded: boolean = false;
  messageUser: string = '';
  chatbotReply: String | string | undefined = '';
  // indexMain = -1;
  indexOption = -1;
  indexOfReply = [-1, -1, -1];
  indexOfEdit = [-1, -1, -1];
  isEditOptionChatbot = false;
  //addMainVisible:boolean=false;

  //Avatar
  avatarImage: String | string = '';
  avatarImageLoaded: boolean = false;
  avatarText: String = '';
  avatarTextPreview :String = '';
  avatarActionSave: Action = {
    name: '',
    type: '',
    assistant: '',
    message: {
      message: '',
      image: '',
    },
  };

  previewAvatar: boolean = false;

  newChatbotOptionForm = new FormGroup({
    option: new FormControl('', [Validators.required]),
    reply: new FormControl('', [Validators.required]),
  });
  chatbotId: string = '';
  editChatbot: boolean = false;

  currentCriteriaEdit: Action = {
    name: '',
    assistant: '',
    type: '',
    message: {
      message: ''
    }
  };

  actionList: Action[] = [];
  editingAction: boolean = false;

  constructor(private assistantService: AssistantService,private sanitizer: DomSanitizer, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.actionType != 'Avatar') {
      this.getChatbotByAvatar();
    } else {
      this.getActions(this.assistantId);
    }
  }

  setCurrentActionToEdit() {
    if (this.currentCriteriaEdit.name != undefined) {
      this.editingAction = true;
      this.actionName = this.currentCriteriaEdit.name;
      if(this.currentCriteriaEdit.message != undefined) {
        this.avatarText = this.currentCriteriaEdit.message.message;  
      }
      console.log(this.currentCriteriaEdit);
      this.saveTempAvatar();
    }
    else {
      this.editingAction = false;
      this.clearAllAvatar();
    }

  }

  clearAllAvatar() {
    this.actionName = "";
    this.avatarText = "";
    this.previewAvatar = false;
  }

  getActions(id:any) {
    this.http
      .get<Action[]>('https://va.neurone.info/api/action/assistant/' + id)
      .subscribe((res) => {
        console.log('acciones ', res);
        this.actionList = res;
      });
  }

  /* ---- Avatar ---- */
  /*  text decoration  */
  boldAvatar() {
    this.avatarText = this.avatarText + '<b>' + 'text' + '</b>';
  }

  italicAvatar() {
    this.avatarText = this.avatarText + '<i>' + 'text' + '</i>';
  }

  underlineAvatar() {
    this.avatarText = this.avatarText + '<u>' + 'text' + '</u>';
  }
  /*  validation  */

  validateNameAction() {
    if (this.actionName.length > 0) {
      this.actionNameIsEmpty = false;
      return true;
    } else {
      this.actionNameIsEmpty = true;
      return false;
    }
  }

  validateMessageAvatar() {
    if (this.avatarText.length > 0) {
      this.actionAvatarMessageIsEmpty = false;
      return true;
    } else {
      this.actionAvatarMessageIsEmpty = true;
      return false;
    }
  }

  /* ---- Chatbot ---- */
  /*  validation  */

  validateChatbotOption(data: any) {
    if (
      data.textOption == '' ||
      data.textOption.lengh == 0 ||
      data.replyType == undefined
    ) {
      //alert("Option esta vacio")
      return false;
    } else {
      if (data.replyType == 'texto') {
        //alert("textoooo")
        if (data.textReply == '') {
          //alert("reply esta vacio")
          return false;
        }
      }
      /*if(data.replyType == "image"){
        //Validacion pendiente
      }*/
    }
    //alert("Todo bien uwu")
    return true;
  }

  saveActionDB(json: Action) {
    console.log('Save action DB');
    this.http
      .post('https://va.neurone.info/api/action', json)
      .subscribe((res) => console.log(res));
  }

  upload(){
    this.assistantService.uploadImage(this.images).subscribe(
      (res) => {
        this.imageName= 'https://va.neurone.info/api/images/' + res.fileName;
      },
      (err) => {
        console.log(err);
        this.imageName=  "noFile";
      }
    );
    
  }

  saveChatbotOption(data: any) {
    if (this.validateChatbotOption(data)) {
      console.log('value:', data);
      if (data.replyType == 'texto') {
        const Option: ChatOption = {
          textOption: data.textOption,
          replyType: data.replyType,
          textReply: data.textReply,
          optionsIn: [],
        };
        if (this.isEditOptionChatbot) {
          //Si se va a editar algo
          this.editOptionLayer(Option);
          this.isEditOptionChatbot = false;
        } else {
          //Si es agregar algo
          this.addOptionLayer(Option);
        }
        // if (this.indexMain == -1) {
        //   this.chatbotOptionList.push(Option);
        // } else {
        //   console.log(this.chatbotOptionList[this.indexMain]);
        //   this.chatbotOptionList[this.indexMain].optionsIn.push(Option);
        //   this.addChatbotReplyClear();
        // }
      }
      if (data.replyType == 'imagen') {
        this.upload();

        if(this.imageName!= 'noFile' && this.imageName != undefined){
          const Option: ChatOption = {
            textOption: data.textOption,
            replyType: data.replyType,
            optionsIn: [],
            filename: this.imageName,
          };
          console.log(Option)
          if (this.isEditOptionChatbot) {
            //Si se va a editar algo
            this.editOptionLayer(Option);
            this.isEditOptionChatbot = false;
          } else {
            //Si es agregar algo
            this.addOptionLayer(Option);
          }

        }

      }
    }
  }

  addOptionLayer(option: ChatOption) {
    let index = this.checkIndexCreate();
    console.log(index);
    switch (index) {
      case 1:
        // this.chatbotOptionList.push(option);
        this.chatbotOptionList[this.indexOfReply[0]].optionsIn.push(option);
        this.resetIndexOfCreate();
        break;
      case 2:
        // this.chatbotOptionList[this.indexOfReply[0]].optionsIn.push(option);
        // this.resetIndexOfCreate();
        this.chatbotOptionList[this.indexOfReply[0]].optionsIn[
          this.indexOfReply[1]
        ].optionsIn.push(option);
        this.resetIndexOfCreate();
        break;
      case 3:
        // this.chatbotOptionList[this.indexOfReply[0]].optionsIn[this.indexOfReply[1]].optionsIn.push(option);
        // this.resetIndexOfCreate();
        break;
      case 0:
        this.chatbotOptionList.push(option);
        break;
    }
    this.addChatbotReplyClear();
  }

  editOptionLayer(option: ChatOption) {
    let index = this.checkIndexEdit();
    switch (index) {
      case 1:
        option.optionsIn =
          this.chatbotOptionList[this.indexOfEdit[0]].optionsIn;
        this.chatbotOptionList[this.indexOfEdit[0]] = option;
        break;
      case 2:
        option.optionsIn =
          this.chatbotOptionList[this.indexOfEdit[0]].optionsIn[
            this.indexOfEdit[1]
          ].optionsIn;
        this.chatbotOptionList[this.indexOfEdit[0]].optionsIn[
          this.indexOfEdit[1]
        ] = option;
        break;
      case 3:
        this.chatbotOptionList[this.indexOfEdit[0]].optionsIn[
          this.indexOfEdit[1]
        ].optionsIn.push(option);
        break;
      case 0:
        break;
    }
    this.resetindexOfEdit();
  }

  deleteChatbotOption(i: number) {
    this.chatbotOptionList.splice(i, 1);
  }

  deleteChatbotOptionLayer(i: number, j: number) {
    this.chatbotOptionList[i].optionsIn.splice(j, 1);
  }

  deleteChatbotOptionLayerTwo(i: number, j: number, k: number) {
    this.chatbotOptionList[i].optionsIn[j].optionsIn.splice(k, 1);
  }

  editChatbotOption(i: number) {
    this.isEditOptionChatbot = true;
    console.log(this.chatbotOptionList);
    this.indexOfEdit[0] = i;
    this.messageUser = this.chatbotOptionList[i].textOption;
    this.replyType = this.chatbotOptionList[i].replyType;
    if (this.chatbotOptionList[i].replyType == 'texto') {
      this.chatbotReply = this.chatbotOptionList[i].textReply;
    }
  }

  editChatbotOptionLayer(i: number, j: number) {
    this.isEditOptionChatbot = true;
    this.indexOfEdit[0] = i;
    this.indexOfEdit[1] = j;
    console.log(this.chatbotOptionList);
    this.messageUser = this.chatbotOptionList[i].optionsIn[j].textOption;
    // this.replyType
    if (this.chatbotOptionList[i].optionsIn[j].replyType == 'texto') {
      this.chatbotReply = this.chatbotOptionList[i].optionsIn[j].textReply;
    }
  }

  editChatbotOptionLayerTwo(i: number, j: number, k: number) {
    this.isEditOptionChatbot = true;
    this.indexOfEdit[0] = i;
    this.indexOfEdit[1] = j;
    this.indexOfEdit[2] = k;
    console.log(this.chatbotOptionList);
    this.messageUser =
      this.chatbotOptionList[i].optionsIn[j].optionsIn[k].textOption;
    // this.replyType
    if (this.chatbotOptionList[i].optionsIn[j].replyType == 'texto') {
      this.chatbotReply =
        this.chatbotOptionList[i].optionsIn[j].optionsIn[k].textReply;
    }
  }

  resetindexOfEdit() {
    this.indexOfEdit = [-1, -1, -1];
  }

  resetIndexOfCreate() {
    this.indexOfReply = [-1, -1, -1];
  }

  checkIndexCreate() {
    if (this.isEditOptionChatbot == false) {
      if (this.indexOfReply[0] != -1 && this.indexOfReply[1] == -1) {
        return 1;
      } else {
        if (this.indexOfReply[1] != -1 && this.indexOfReply[2] == -1) {
          return 2;
        }
        // else{
        //   return 3;
        // }
      }
    }
    return 0;
  }

  checkIndexEdit() {
    if (this.isEditOptionChatbot != false) {
      if (this.indexOfEdit[0] != -1 && this.indexOfEdit[1] == -1) {
        return 1;
      } else {
        if (this.indexOfEdit[1] != -1 && this.indexOfEdit[2] == -1) {
          return 2;
        } else {
          return 3;
        }
      }
    }
    return 0;
  }

  isEditOption() {
    if (
      this.indexOfEdit[0] != -1 ||
      this.indexOfEdit[1] != -1 ||
      this.indexOfEdit[2] != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  newChatbotReplyMain(i: number) {
    this.isEditOptionChatbot = false;
    this.indexOfReply[0] = i;
    // this.indexMain = i;
    this.messageUser = '';
    this.chatbotReply = '';
    //this.addMainVisible = true;
    //this.chatbotOptionList[i].optionList.push();
  }

  newChatbotReplyMainLayer(i: number, j: number) {
    this.isEditOptionChatbot = false;
    this.indexOfReply[0] = i;
    this.indexOfReply[1] = j;
    // this.indexMain = i;
    this.messageUser = '';
    this.chatbotReply = '';
    //this.addMainVisible = true;
    //this.chatbotOptionList[i].optionList.push();
  }

  addChatbotReplyClear() {
    // this.indexMain = -1;
    this.messageUser = '';
    this.chatbotReply = '';
    //this.addMainVisible = false;
  }

  SaveChatbot(): Chatbot {
    const saveChatbot: Chatbot = {
      //assistant: this.assistantID,
      message: this.chatbotMessage,
      optionList: this.chatbotOptionList,
    };
    this.chatbotOptionList = [];
    return saveChatbot;
  }

  saveTempAvatar() {
    let validateName = this.validateNameAction();
    let validateMessage = this.validateMessageAvatar();
    if (
      validateName &&
      validateMessage
      /* && this.avatarImageLoaded */
    ) {
      let saveAction: Action = {
        name: this.actionName,
        type: 'avatar',
        assistant: this.assistantId,
        message: {
          message: this.avatarText,
          image: 'https://i.imgur.com/4XSQFLx.png',
        },
      };
      this.avatarActionSave = saveAction;
      this.avatarTextPreview =  this.avatarText;
      this.previewAvatar = true;
    }
  }

  saveActionAvatar() {
    //if edicion...
    //else
    if (this.avatarActionSave.name != undefined && this.avatarActionSave.message != undefined && this.avatarActionSave.message.message.length > 0) { //&& 
      if (this.editingAction == true) {

        this.http
          .put('https://va.neurone.info/api/action/' + this.currentCriteriaEdit._id, this.avatarActionSave)
          .subscribe((res) => {
            console.log(res);
            this.editingAction = false;
            this.clearAllAvatar();
            this.getActions(this.assistantId);
          });

      } else {
        console.log(this.avatarActionSave);
        this.http
          .post('https://va.neurone.info/api/action', this.avatarActionSave)
          .subscribe((res) => {
            this.clearAllAvatar();
            this.getActions(this.assistantId);
          });
      }
    }
  }

  SaveAction(type: string) {
    if (type == 'chatbot') {
      let saveAction: Action = {
        name: this.actionName,
        type: type,
        assistant: this.assistantId,
        chatbot: {
          message: this.chatbotMessage,
          optionList: this.chatbotOptionList,
        },
      };
      console.log(saveAction);
      this.http
        .post<any>(environment.neuroneVAUrl + '/action', saveAction)
        .subscribe((res) => {
          console.log(res);
          this.chatbotId = res._id;
          this.checkChatbotEdit();
        });
    }
  }

  EditChatbotAction() {
    console.log(this.chatbotOptionList);
    let saveAction: Action = {
      name: this.actionName,
      type: 'chatbot',
      assistant: this.assistantId,
      chatbot: {
        message: this.chatbotMessage,
        optionList: this.chatbotOptionList,
      },
    };
    this.http
      .put<any>(
        environment.neuroneVAUrl + '/action/' + this.chatbotId,
        saveAction
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  checkChatbotEdit() {
    if (this.chatbotId != '') {
      this.editChatbot = true;
    }
  }

  getChatbotByAvatar() {
    if (this.actionType != 'Avatar') {
      this.http
        .get<any>(
          environment.neuroneVAUrl + '/action/assistant/' + this.assistantId
        )
        .subscribe((res) => {
          console.log('get chatbot avatar', res);
          if (res.length > 0) {
            if (res[0].type != 'avatar') {
              this.chatbotId = res[0]._id;
              this.checkChatbotEdit();
              this.actionName = res[0].name;
              this.chatbotMessage = res[0].chatbot.message;
              this.chatbotOptionList = res[0].chatbot.optionList;
              console.log(this.chatbotOptionList);
            }
          }
        });
    }
  }
  /* ---- Image ---- */

  getImage(event: any) {
    if(event.target.files.length>0){
      const file = event.target.files[0];
      this.images = file;
      console.log(this.images)
    }
  }

}

