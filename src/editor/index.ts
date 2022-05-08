import 'reflect-metadata';
import { Container } from 'typedi';
import { DomAction } from './action/dom';
import { EventAction } from './action/event';
import { EditAction } from './action/edit';

class QCDown {
  editingDom!: HTMLElement;
  domAction!: DomAction;
  editAction!: EditAction;
  eventAction!: EventAction;

  constructor(containerDomParam: HTMLElement | string) {
    this.initDI();

    this.editingDom = this.domAction.initEditContainer(containerDomParam);

    this.domAction.setStartRangeByDom(this.editingDom);

    this.eventAction.bindKeyboardEvent(this.editingDom);
  }

  initDI() {
    this.domAction = Container.get(DomAction);
    this.eventAction = Container.get(EventAction);
    this.editAction = Container.get(EditAction);
  }
}

export default QCDown;
