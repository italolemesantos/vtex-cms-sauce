var path = require('path'),
    fs = require('fs'),
    create = require('vtex-cms-sauce').create;
var cms = create('https://idastoredev.vtexcommercestable.com.br');
var appDirectory = fs.realpathSync(process.cwd());
var resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
var templatePrefix = '';
var templatesDir = resolveApp('dist/templates')
var subtemplatesDir = resolveApp('dist/subtemplates')
var shelvesDir = resolveApp('dist/shelves')
var filesDir = resolveApp('dist/arquivos')
var getFiles = dir => fs.readdirSync(dir).filter(str => str[0] !== '_')
var sendFiles = (dir, type = 'template') => new Promise(async (resolve, reject) => {
    try {
        let logs = ''
        var files = fs.readdirSync(dir).filter(str => str[0] !== '_')
        for (let i = 0; i < files.length; i++) {
            let log
            let file = files[i]
            let content = fs.readFileSync(`${dir}/${file}`, 'utf8')
            if (type === 'template') log = await cms.saveTemplate(templatePrefix + file.replace('.html', '').replace('index', 'Home'), content)
            else if (type === 'subtemplate') log = await cms.saveTemplate(templatePrefix + file.replace('.html', ''), content, true)
            else if (type === 'shelf') log = await cms.saveShelfTemplate(templatePrefix + file.replace('.html', ''), content, 'prateleira')
            else if (type === 'file') log = await cms.saveFile(`${dir}/${file}`)
            logs += `${log}\n`
        }
        console.log(logs)
        resolve(sendFiles)
    } catch (err) {
        console.error('Error while sending files.')
        reject(sendFiles)
    }
})
sendFiles(templatesDir, 'template')
    .then(() => sendFiles(subtemplatesDir, 'subtemplate'))
    .then(() => sendFiles(shelvesDir, 'shelf'))
    .then(() => sendFiles(filesDir, 'file'))
