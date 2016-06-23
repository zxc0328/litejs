var assert = chai.assert;

describe('lite.extend()', function() {

  var settings = {
      "xnumber1": 5,
      "xnumber2": 7,
      "xstring1": "peter",
      "xstring2": "pan"
    },
    options = {
      "xnumber2": 1,
      "xstring2": "x",
      "xxx": "newstring"
    },
    optionsCopy = {
      "xnumber2": 1,
      "xstring2": "x",
      "xxx": "newstring"
    },
    merged = {
      "xnumber1": 5,
      "xnumber2": 1,
      "xstring1": "peter",
      "xstring2": "x",
      "xxx": "newstring"
    },
    deep1 = {
      "foo": {
        "bar": true
      }
    },
    deep2 = {
      "foo": {
        "baz": true
      },
      "foo2": document
    },
    deep2copy = {
      "foo": {
        "baz": true
      },
      "foo2": document
    },
    deepmerged = {
      "foo": {
        "bar": true,
        "baz": true
      },
      "foo2": document
    },
    arr = [1, 2, 3],
    nestedarray = {
      "arr": arr
    }

  it("Check if extended: settings must be extended", function() {
    $.extend(settings, options)
    assert.deepEqual(settings, merged, "Check if extended: settings must be extended")
    assert.deepEqual(options, optionsCopy, "Check if not modified: options must not be modified")
  })

  it("Check if foo: settings must be extended", function() {
    $.extend(true, deep1, deep2)
    assert.deepEqual(deep1["foo"], deepmerged["foo"], "Check if foo: settings must be extended")
    assert.deepEqual(deep2["foo"], deep2copy["foo"], "Check if not deep2: options must not be modified")
    assert.equal(deep1["foo2"], document, "Make sure that a deep clone was not attempted on the document")
  })

  it("Should copy length correctly", function() {
    var empty = {},
      optionsWithLength = {
        "foo": {
          "length": -1
        }
      };
    $.extend(true, empty, optionsWithLength);
    assert.deepEqual(empty["foo"], optionsWithLength["foo"], "The length property must copy correctly");
  })

  it("Should copy Dates correctly", function() {
    var empty = {},
      optionsWithDate = {
        "foo": {
          "date": new Date()
        }
      };
    $.extend(true, empty, optionsWithDate);
    assert.ok(empty["foo"].date === optionsWithDate["foo"].date, "Dates copy correctly");
  })

  it("Should copy custom objects correctly", function() {
    /** @constructor */
    var myKlass = function() {};
    var customObject = new myKlass();
    var optionsWithCustomObject = {
      "foo": {
        "date": customObject
      }
    };
    var empty = {};
    $.extend(true, empty, optionsWithCustomObject);
    assert.ok(empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly (no methods)");
  })

})
