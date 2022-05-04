export interface NodeSchema {
  rule: string;
  tag: string;
  toDom: (params: ParseHtmlParams) => HTMLElement;
}

export interface ParseHtmlParams {
  innerHTML?: string;
  setRange?: (targetDom: HTMLElement) => void;
}
