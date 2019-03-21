/*jshint unused:false, expr:true */

/**
 * Test: apiDoc full parse
 */

// node modules
var apidoc = require('@zeromake/apidoc-core');
var exec   = require('child_process').exec;
var fs     = require('fs-extra');
var semver = require('semver');

var versions = require('apidoc-example').versions;

describe('apiDoc custom markdown parser', () => {

    // get latest example for the used apidoc-spec
    var latestExampleVersion = semver.maxSatisfying(versions, '~' + apidoc.getSpecificationVersion()); // ~0.2.0 = >=0.2.0 <0.3.0

    var exampleBasePath = 'node_modules/apidoc-example/' + latestExampleVersion;
    var fixturePath = exampleBasePath + '/fixtures';

    var fixtureFiles = [
        'api_data.js',
        'api_data.json',
        'api_project.js',
        'api_project.json',
        'index.html'
    ];

    var markdownFile     = '../test/fixtures/custom_markdown_parser.js';
    var markdownFileBase = '../test/fixtures/custom_markdown_parser.js';

    beforeAll(function(done) {
        fs.removeSync('tmp/');

        done();
    });

    afterAll(function(done) {
        done();
    });

    // Render static text.
    test('should render static text with custom markdown parser', done => {
        var Markdown = require(markdownFile);
        var markdownParser = new Markdown();
        var text = markdownParser.render('some text');
        expect(text).toBe('Custom Markdown Parser: some text');
        done();
    });

    // create
    test('should create example in tmp/', done => {
        var cmd = 'node ./bin/apidoc -i ' + exampleBasePath + '/src/ -o tmp/ -t test/template/ --markdown ' + markdownFileBase + ' --silent';
        exec(cmd, function(err, stdout, stderr) {
            if (err)
                throw err;

            if (stderr)
                throw stderr;

            done();
        });
    });

    // check
    test('should find created files', done => {
        fixtureFiles.forEach(function(name) {
            expect(fs.existsSync(fixturePath + '/' + name)).toBe(true);
        });
        done();
    });

    // Count how many custom parser text inserts where found.
    test('created files should have custom text', done => {
        var countCustomText = 0;
        fixtureFiles.forEach(function(name) {
            var createdContent = fs.readFileSync('tmp/' + name, 'utf8');

            var createdLines = createdContent.split(/[\r\n]/);

            for (var lineNumber = 0; lineNumber < createdLines.length; lineNumber += 1) {
                if (createdLines[lineNumber].indexOf('Custom Markdown Parser: ') !== -1)
                    countCustomText++;
            }
        });

        expect(countCustomText).not.toEqual(0);

        done();
    });

});
