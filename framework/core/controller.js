
import ModObject from './mod-object';

export default class Controller extends ModObject {
  constructor(instanceProperties) {
    super(instanceProperties);

    // console.log(this);

    // this._normalizeModel();
    this._parseTemplate();
    this.render();
  }

  _normalizeModel() {
    if (!(this.model instanceof ModObject)) {
      this.model = new ModObject(this.model);
    }
  }

  _parseTemplate() {
    if (!this.template) {
      throw new Error('A controller must have a template set!')
    } 
    this.template = jQuery(this.template);
    this._bindElements();
  }

  _bindElements() {
    this.$bindedElements = this.template.find('[data-bind]');
    let model = this.get('model');

    this.$bindedElements.each((i, elm) => {
      let $elm = $(elm);
      let key = $elm.data('bind');
      let to = $elm.data('to') || 'text';
      let of = $elm.data('of');

      if (key in model) {
        model.addObserver(key, this, function(value) {
          // console.log(value);
          if (to === 'text') {
            $elm.text(value);
          }
          else if (to === 'html') {
            $elm.html(value);
          }
          // TODO: error handle `of`
          else if (to === 'attr') {
            $elm.attr(of, value);
          }
          else if (to === 'prop') {
            $elm.prop(of, value);
          }
        });
      }
    });
  }

  render() {
    let model = this.get('model');
    this.$bindedElements.each((i, elm) => {
      let $elm = $(elm);
      let key = $elm.data('bind');
      let to = $elm.data('to') || 'text';
      let of = $elm.data('of');

      if (key in model) {
        let value = model.get(key);
        // console.log(value);
        if (to === 'text') {
          $elm.text(value);
        }
        else if (to === 'html') {
          $elm.html(value);
        }
        // TODO: error handle `of`
        else if (to === 'attr') {
          $elm.attr(of, value);
        }
        else if (to === 'prop') {
          $elm.prop(of, value);
        }
      }
    });
  }
}

/**
 * Template can be either a selector, a DOM object, or a jquery object
 *
 * @method parseTemplate
 * @private
 * @param template
 */
function parseTemplate(template) {
  // TODO:
  // for right now, just wrap whatever is passed in jQuery
  return jQuery(template);
}