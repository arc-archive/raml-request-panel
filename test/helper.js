/* global Promise, fixture */
var RamlRequestTestHelper = {};
RamlRequestTestHelper.getTestRaml = function(file) {
  return new Promise(function(resolve, reject) {
    var baseUrl = location.href.substr(0, location.href.lastIndexOf('/') + 1);
    var parser = fixture('parser');
    var enhancer = fixture('enhancer');
    enhancer.addEventListener('raml-json-enhance-ready', function(e) {
      resolve(e.detail.json);
    });
    parser.loadApi(baseUrl + file)
    .then(function(data) {
      enhancer.json = data.json.specification;
    })
    .catch(function(e) {
      reject(new Error('Parser error: ' + (e.message || 'Some error happened...')));
    });
  });
};
