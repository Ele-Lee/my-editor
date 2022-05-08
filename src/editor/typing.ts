import { DomAction } from './action/dom';

export interface NodeSchema {
  rule: string;
  tag: string;
  toDom: (params: ParseHtmlParams, domAction: DomAction) => HTMLElement;
}

export interface ParseHtmlParams {
  innerHTML?: string;
  setRange?: (targetDom: HTMLElement) => void;
}
