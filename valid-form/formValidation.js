class FormValidation {
  constructor({
                selector,
                onSubmit = () => {},
  }) {
    this.selector = selector;
    this._onCallback = onSubmit;

  }

  init() {
    const form = document.querySelector(this.selector);
    form.classList.add('form-valid-box');
    const fields = form.querySelectorAll('input, select, textarea');
    let formObj = {};
    const validFields = {};
    const validate = {
      text: {
        regExp: /^[a-zA-Zа-яА-Я ]{2,3000}$/
      },
      email: {
        regExp: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
      },

    };
    let valid = false;

    const onValidate = ({target, type}) => {
      form.classList.remove('form-invalid')

      const nameAtr = target.dataset.name;
      const typeAtr = target.dataset.type;
      const isText = typeAtr === 'text';
      const isPhone = typeAtr === 'phone';
      const isEmail = typeAtr === 'email';
      const isCheckbox = typeAtr === 'checkbox';
      const isSelect = typeAtr === 'select';

      let value = target.value;
      const valueTrim = value.trim();
      let length = valueTrim.length;

      const required = target.hasAttribute('data-required');
      const validClass = target.dataset.validClass ? target.dataset.validClass : 'invalid';
      const regExpString = target.dataset.regexp;
      const regExp = new RegExp(regExpString)
      const messageError = target.dataset.errorMessage ? target.dataset.errorMessage : 'Error!'
      const minValue = target.dataset.min ? target.dataset.min : 0;
      const maxValue = target.dataset.max ? target.dataset.max : 500;

      const onValidFields = (error) => {
        validFields[nameAtr] = {
          error: error,
          messageError: messageError
        };
      }

      ///  validate Text
      if (isText) {
        if (required) {
          onValidFields(true)
          if (length > +minValue && length <= +maxValue) {
            target.classList.remove(validClass)
            onValidFields(false)
          } else {
            target.classList.add(validClass)
            onValidFields(true)
          }
        } else {
          if (length <= +maxValue) {
            target.classList.remove(validClass)
            onValidFields(false)
          } else {
            target.classList.add(validClass)
            onValidFields(true)
          }
        }
      }
      ///  validate Phone
      if (isPhone) {
        function setCursorPosition(pos, elem) {
          elem.focus();
          if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
          } else if (elem.createTextRange) {
            console.log('false')
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select()
          }
        }
        var matrix = "+ (380) __-___-__-__",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = target.value.replace(/\D/g, "");

        if (val[3] === '3' || val[3] === '8' || val[3] === '0' || val[4] === '0') val = def;
        if (def.length >= val.length) val = def;

        target.value = matrix.replace(/./g, function (a) {
          return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
        });

        if (required) {
          onValidFields(true)
          if (type == "blur") {
            if (target.value.length <= 2) target.value = ""
          } else setCursorPosition(target.value.length, target)
          if (target.value.length === 20) {
            target.classList.remove(validClass);
            onValidFields(false)
          } else {
            target.classList.add(validClass)
            onValidFields(true)
          }
        } else {
          onValidFields(false)
          if (type == "blur") {
            if (target.value.length == 2) target.value = ""
          } else setCursorPosition(target.value.length, target)
          if (target.value.length === 20) {
            target.classList.remove(validClass);
            onValidFields(false)
          }
        }
      }
      ///  validate Email
      if (isEmail) {
        if (required) {
          onValidFields(true)
          if (regExpString) {
            if (regExp.test(value)) {
              onValidFields(false)
              target.classList.remove(validClass)
            }else {
              onValidFields(true)
              target.classList.add(validClass)
            }
          } else {
            if (validate[typeAtr].regExp.test(value)) {
              onValidFields(false)
              target.classList.remove(validClass)
            } else {
              onValidFields(true)
              target.classList.add(validClass);
            }
          }
        } else {
          onValidFields(false)
          if (regExpString) {
            if (regExp.test(value)) {
              onValidFields(false)
            }else {
              onValidFields(true)
            }
          } else {
            if (validate[typeAtr].regExp.test(value)) {
              onValidFields(false)
            } else {
              onValidFields(false)
            }
          }
        }
      }
      /// validate Checkbox
      if (isCheckbox) {
        if (required) {
          onValidFields(true)
          if (target.checked) {
            onValidFields(false)
          } else {
            onValidFields(true)
          }
        } else {
          onValidFields(false)
        }
      }
      /// validate Select
      if (isSelect) {
        if (required) {
          onValidFields(true)
          if (value) {
            onValidFields(false)
            target.classList.remove(validClass)
          } else  {
            target.classList.add(validClass)
            onValidFields(true)
          }
        } else {
          onValidFields(false)
        }
      }
    }

    const onChange = ({target, type}) => {
      onValidate({target, type})
    }

    fields.forEach(item => {
      if (item.dataset.type === 'phone') {
        item.addEventListener('input', onChange);
        item.addEventListener('focus', onChange);
      }
      // item.addEventListener('focus', onChange);
      // item.addEventListener('input', onChange);
      item.addEventListener('blur', onChange);
    })

    const onResetForm = () => {
      fields.forEach(item => {
        if (item.dataset.type === 'checkbox') {
          item.checked = false;
        } else {
          item.value = '';
        }
      })
      formObj = {};
    }

    const onSubmitForm = (e) => {
      e.preventDefault();
      valid = true;

      for (let i = 0; i < fields.length; i++) {
        onValidate({target: fields[i], type: fields[i].dataset.type})

        const parent = fields[i].parentNode;
        parent.classList.add('error-mssg-box')
        const errorText = parent.querySelector('span');
        if (errorText) {
          errorText.remove();
        }
        if (validFields[fields[i].dataset.name].error) {
          valid = false;
          const errorContainer = document.createElement('span');
          errorContainer.classList.add('error-mssg');
          errorContainer.textContent = validFields[fields[i].dataset.name].messageError
          // form.classList.add('form-invalid')
          parent.appendChild(errorContainer);
        } else {
          if (fields[i].dataset.type === 'checkbox') {
            formObj[fields[i].dataset.name] = fields[i].checked;
          } else {
            formObj[fields[i].dataset.name] = fields[i].value;
            // form.classList.remove('form-invalid')
          }
        }
      }
      if (valid) {
        this._onCallback(formObj);
        onResetForm();
      }
    }

    form.addEventListener('submit', onSubmitForm.bind(this))

  }

}

const form1 = new FormValidation({
  selector: '#form',
  onSubmit: (val) => {
    console.log('callback', val)
  }
})

form1.init();
