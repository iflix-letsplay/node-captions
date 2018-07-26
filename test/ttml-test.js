var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate TTML', function () {
    var SCCFile,
        jsonObj,
        ttmlFile;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            ttmlFile = captions.ttml.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 109119', function(done) {
        ttmlFile.length.should.equal(109119);
        done();
    });

    it('allow to change header', function(done) {
        var customHeader = [
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
          "<tt xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://www.w3.org/ns/ttml\" xmlns:tt=\"http://www.w3.org/ns/ttml\" xmlns:tts=\"http://www.w3.org/ns/ttml#styling\" xmlns:ttp=\"http://www.w3.org/ns/ttml#parameter\" xml:lang=\"en-US\" ttp:timeBase=\"smpte\" ttp:frameRate=\"24\" ttp:frameRateMultiplier=\"1000 1001\" ttp:dropMode=\"nonDrop\">",
          "<head>",
          "<styling>",
          "<style xml:id=\"normal\" tts:color=\"white\" tts:backgroundColor=\"black\" tts:opacity=\"0.70\" tts:fontFamily=\"monospace\" tts:fontSize=\"80%\" tts:fontWeight=\"normal\" tts:fontStyle=\"normal\"/>",
          "</styling>",
          "</head>",
          "<body>",
          "<div>"
        ].join('\n')
        var customHeaderTtmlFile = captions.ttml.generate(jsonObj, { header: [customHeader] });
        customHeaderTtmlFile.should.include(customHeader)
        done();
    });
});

