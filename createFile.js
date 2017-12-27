/* i18nIgnore*/
/**
 *  create by miaoyu  2017/12/7
 * 
 *  生成黑白版的 css js 文件
 */


// 加载File System读写模块  
var fs = require('fs');  

var XLSX = require('xlsx');

var workbook = XLSX.readFile('./color_list.xlsx');

var data = XLSX.utils.sheet_to_json(workbook.Sheets["对照清单"])

var allColor = {}

//生成js文件
function createJsFile(file) {
    var str
    str = '//i18nIgnore颜色的js文件\n//根据cookie获取当前主题色，默认为黑色\n\n\n'

    str += `
    var theme = window.loginInfo.themeInfo.theme
        `
    // 白色
    str += '// 白色\nvar light = {\n'

    allColor.light = {}

    data.forEach(function(element,index){
        str += '    ' + element.class + ':"rgba(' + element.RGBA_light + ')",\n'
    })
    str += '}\n'

    // 黑色
    str += '// 黑色\nvar dark = {\n'

    allColor.dark = {}

    data.forEach(function(element,index){
        str += '    ' + element.class + ':"rgba(' + element.RGBA_dark + ')",\n'
    })
    str += '}\n'
    str += `

    if (typeof window !== "undefined") {
        if (theme && theme == "light") {
            window.J_color = light
        } else {
            window.J_color = dark        
        }
    }
    `
    writeFile(file, str) 
}

//生成css文件
function createCssFile(name, file) {
    var str = ''
    str = '/* i18nIgnore' + name + '*/\n\n\n'

    data.forEach(function(element,index){
        let classname = element.class
        let color = element['RGBA_' + name]
        let style =  element['style_' + name]
        let key = null
        
        if (element.Notes.indexOf("悬停") !== -1) {
            str += '.' + classname + ':hover{\n'
        } else {
            str += '.' + classname + '{\n'
        }
        
        if (classname.indexOf('bg') !== -1) {
            let a = color.split(';')
            key = "background"
            if (a.length > 1) {
                str += '    ' + key + ':linear-gradient(rgba(' +a[0]+ '),rgba(' +a[1]+ '));\n'
            } else {
                str += '    ' + key + ':rgba(' + color + ');\n'
            }
            
            if (style) {
                let b = style.split(';')
                b.forEach(function(e,i){
                    str += '    ' + e + ';\n'
                })
            }
        } else {
            key = "color"
            str += '    ' + key + ':rgba(' + color + ');\n'
        }
        str += '}\n'
    })

    str += "/*覆盖antdesignCss*/" + '\n'

    str += `

.special_modal_box .ant-modal-mask{
    background-color: ${allColor[name]['bg_level4']} !important;
}

.extract_modal_box .ant-modal-mask{
    background-color: ${allColor[name]['bg_level4']} !important;
}

.create_modal_box .ant-modal-mask{
    background-color: ${allColor[name]['bg_level4']} !important;
}
    `

    writeFile(file, str) 
}

// 写文件
function writeFile(file, data){  
    fs.writeFile(file, data,function(err, data){
        if(err) {
            console.log(file+'写文件操作失败:',err);
        } else {
            console.log('文件写入成功'+file);
        }    
    });
} 

function init() {
    createJsFile('./js/theme.js')
    createCssFile('light', './css/lightTheme.less')
    createCssFile('dark', './css/darkTheme.less')
}

init()



