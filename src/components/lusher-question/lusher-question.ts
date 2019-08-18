import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lusher-question',
  templateUrl: 'lusher-question.html'
})
export class LusherQuestionComponent {

  @Input() question: string;
  @Input() colors: Array<any>;
  @Output() onChoosen = new EventEmitter<number>();

  constructor() {
    console.log('Hello LusherQuestionComponent Component');
  }

  onChooseColor(color) {
  	this.onChoosen.emit(color);
  }

}
