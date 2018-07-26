var captions = require('../captions.js'),
    should = require('should')
    fs = require('fs');

describe('Read SCC file, generate TTML', function () {
    var SCCFile,
        jsonObj,
        ttmlFile,
        sample = fs.readFileSync('./test/captions/test_ttml.xml').toString();

    before(function(done) {
        captions.srt.read('./test/captions/test.srt', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.srt.toJSON(data);
            ttmlFile = captions.ttml.generate(jsonObj);
            done();
        });
    });

    it('return valid ttml', function(done) {
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
        ttmlFile = captions.ttml.generate(jsonObj, {
          header: [customHeader],
          lineTemplate: '<p begin="{startTime}" style="normal" end="{endTime}">{text}</p>'
        });
        // fs.writeFileSync('./test/captions/test_ttml.xml', ttmlFile) // use this line to update sample
        ttmlFile.should.equal(sample)
        done();
    });
});

