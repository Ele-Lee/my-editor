import { Service, Inject } from 'typedi';
import { defaultPlaceholder } from '../utils/constant';
import markTagAdapterMap from '../parse';
import { DomAction } from './dom';
import { replaceDom } from '../utils/dom';

@Service()
export class EditAction {
  @Inject()
  domAction!: DomAction;

  parseText(range: Range) {
    const curDomNodeValue = range.startContainer.nodeValue;

    if (!curDomNodeValue) {
      return;
    }
    const filstSpaceIndex = curDomNodeValue.indexOf(' ');
    const markTagType = curDomNodeValue.substring(0, filstSpaceIndex)!;

    if (!markTagAdapterMap[markTagType]) {
      return;
    }
    const curInputtingDom = this.domAction.getCurDomByRange(range);

    const htmlTag = markTagAdapterMap[markTagType].toDom(
      {
        innerHTML:
          curDomNodeValue.substring(filstSpaceIndex + 1) || defaultPlaceholder,
        setRange: this.domAction.setStartRangeByDom,
      },
      this.domAction
    );

    replaceDom(curInputtingDom, htmlTag);
  }
}
