import { Service, Inject } from 'typedi';
import { defaultPlaceholder } from '../utils/constant';
import markTagAdapterMap from '../parse';
import { DomAction } from './dom';
import { replaceDom } from '../utils/dom';

@Service()
export class EditAction {
  @Inject()
  domAction!: DomAction;

  parseText(range: Range, curInputChar: string) {
    const curDomNodeValue = range.startContainer.nodeValue + curInputChar;
    if (!curDomNodeValue) {
      return;
    }
    const firstSpaceIndex = curDomNodeValue.indexOf(' ');
    const markTagType = curDomNodeValue.substring(0, firstSpaceIndex)!;
    if (!markTagAdapterMap[markTagType]) {
      return;
    }
    const curInputtingDom = this.domAction.getCurDomByRange(range);
    const htmlTag = markTagAdapterMap[markTagType].toDom(
      {
        innerHTML:
          curDomNodeValue.substring(firstSpaceIndex + 1) || defaultPlaceholder,
        setRange: this.domAction.setStartRangeByDom,
        curInputChar,
        curInputtingDom
      },
      this.domAction
    );

    replaceDom(curInputtingDom, htmlTag);
  }
}
