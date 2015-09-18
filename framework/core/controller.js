
import ModObject from './mod-object';

export default class Controller extends ModObject {
  constructor(instanceProperties) {
    super(instanceProperties);

    // console.log(this);

    this._normalizeModel();
    this._parseTemplate();
    this.render();
    this._addModelChangeObserver();
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
    let model = this.model;

    this.$bindedElements.each((i, elm) => {
      let $elm = $(elm);
      let key = $elm.data('bind');
      let to = $elm.data('to') || 'text';
      let of = $elm.data('of');

      // add data down observer
      model.addObserver(key, this, function(value) {
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

      // if element is editable, add action up observer (two-way binding)
      let tagName = $elm.prop('tagName').toLowerCase();
      if (editableTags.indexOf(tagName) >= 0) {
        $elm.on('change, input', function(e) {
          let value = $elm.val();
          model[key] = value;
        });
      }
    });
  }

  render() {
    let model = this.model;
    this.$bindedElements.each((i, elm) => {
      let $elm = $(elm);
      let key = $elm.data('bind');
      let to = $elm.data('to') || 'text';
      let of = $elm.data('of');

      if (key in model) {
        let value = model[key];
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

  _addModelChangeObserver() {
    this.addObserver('model', this, function() {
      this._bindElements();
      this.render();
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

const editableTags = [
  'input',
  'textarea',
  'select'
];
