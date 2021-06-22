// https://github.com/enzymejs/enzyme/issues/341#issuecomment-263045603
import 'jsdom-global/register';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({
  adapter: new Adapter(),
});
