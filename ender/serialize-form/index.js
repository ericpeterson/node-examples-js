(function () {
  "use strict";

  function serializeForm(formid) {
    var els = []; 

    function handleElement(e) {
      var name = $(e).attr('name')
        , value = $(e).val()
        ;   

      if (!name || '' === value) {
        return;
      }   

      console.log(value);

      els.push({
          name: name
        , value: value
      }); 
    }   

    // TODO insert these in the array in the order
    // they appear in the form rather than by element
    $(formid + ' input').forEach(handleElement);
    $(formid + ' select').forEach(handleElement);
    $(formid + ' textarea').forEach(handleElement);

    return els;
  }

  // Note that this is a potentially lossy conversion.
  // By convention arrays are specified as `xyz[]`,
  // but objects have no such standard
  function mapFormData(data) {
    var obj = {}; 

    function map(datum) {
      var arr
        , name
        , len
        ;

      name = datum.name;
      len = datum.name.length;

      if ('[]' === datum.name.substr(len - 2)) {
        name = datum.name.substr(0, len - 2);
        arr = obj[name] = (obj[name] || []);
        arr.push(datum.value);
      } else {
        obj[datum.name] = datum.value;
      }
    }   

    data.forEach(map);

    return obj;
  }

  function serializeFormObject() {
    return mapFormData(serializeForm.apply(null, arguments));
  }

  module.exports.serializeForm = serializeForm;
  module.exports.serializeFormArray = serializeForm;
  module.exports.serializeFormObject = serializeFormObject;
}());
