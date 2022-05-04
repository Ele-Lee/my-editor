import Heading from './Heading';
import Blockquote from './Blockquote';
import { NodeSchema } from '../typing';

const tagList = [...Heading, Blockquote];

const markTagAdapterMap = tagList.reduce<
  Record<NodeSchema['rule'], NodeSchema>
>((obj, cur) => {
  obj[cur.rule] = cur;
  return obj;
}, {});

export default markTagAdapterMap;
