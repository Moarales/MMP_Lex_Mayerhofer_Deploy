import template from './notFound.hbs';
import './notFound.scss';

export default class NotFoundPage {
  constructor(root) {
    console.log('Hello from Not Found Page');
    this.root = root;
    this.template = template;
  }

  render() {
    this.root.innerHTML = this.template({ heading: 'Not Found' });
  }
}
