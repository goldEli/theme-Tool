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
    var theme
    if ( window.loginInfo) {
        theme = window.loginInfo.theme
    } 
        `
    // 白色
    str += '// 白色\nvar light = {\n'

    allColor.light = {}

    data.forEach(function(element,index){
        if (element.Notes.indexOf("悬停") != -1) {
            allColor.light[element.class + '_hover'] = 'rgba(' + element.RGBA_light + ')'
            str += '    ' + element.class + '_hover:"rgba(' + element.RGBA_light + ')",\n'
        } else {
            allColor.light[element.class] = 'rgba(' + element.RGBA_light + ')'
            str += '    ' + element.class + ':"rgba(' + element.RGBA_light + ')",\n'
        }
    })
    str += '}\n'

    // 黑色
    str += '// 黑色\nvar dark = {\n'

    allColor.dark = {}

    data.forEach(function(element,index){
        if (element.Notes.indexOf("悬停") != -1) {
            allColor.dark[element.class+'_hover'] = 'rgba(' + element.RGBA_dark + ')'
            str += '    ' + element.class + '_hover:"rgba(' + element.RGBA_dark + ')",\n'
        } else {
            allColor.dark[element.class] = 'rgba(' + element.RGBA_dark + ')'
            str += '    ' + element.class + ':"rgba(' + element.RGBA_dark + ')",\n'
        }
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

        if (classname.indexOf('Theme') !== -1) {
            return
        }
        
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
                    ,c = b.join(',')
                
                str += '    box-shadow:' + c.replace(/box-shadow:/g,'') + ';\n'
            }
        } else if (classname.indexOf('border') !== -1) {
            str += '    border-color:rgba(' + color + ');\n'
        } else {
            key = "color"
            str += '    ' + key + ':rgba(' + color + ');\n'
        }
        str += '}\n'
    })


    str += `
/*********************************/

/*覆盖第三方插件样式*/
/*右键**********************************/
.react-contextmenu-item:hover div{
    color:${allColor[name]['font_color_10']}!important;
}

/*antdesign****************************/
a:hover{
    color:${allColor[name]['font_color_10']}!important;
}

/*porpver prompt 提示框*/
.confirm_box .ant-popover-inner{
    background-color:${allColor[name]['bg_color_14']} !important; /*co_bg_rightclick_dialog*/
    
}
.confirm_box .ant-popover-message{

    color:${allColor[name]['font_color_11']} !important;/*co_font_modal_content*/
}
.confirm_box .ant-popover-inner-content{
    color:${allColor[name]['font_color_11']}!important;
}


/*表格*/
.ant-table-thead{
    border:0 !important; 
    background: ${allColor[name].bg_color_8} !important; 
}
.J_Table .ant-table-thead th {
    color:${allColor[name].font_color_10};
}
.J_Table .ant-table-thead  tr.ant-table-row-hover td, 
.J_Table .ant-table-tbody  tr.ant-table-row-hover td, 
.J_Table .ant-table-thead tr:hover td, 
.J_Table .ant-table-tbody tr:hover td 
{
    background: ${allColor[name].bg_color_12_hover}!important;
    color: ${allColor[name].font_color_14}!important;
}

.J_Table .ant-table-tbody tr:hover a,
.J_Table .ant-table-tbody tr:hover span
{
    color: ${allColor[name].font_color_14}!important;
}

.J_Table table{
    border-top:none!important;
    border-left-color: ${allColor[name].border_color_3}!important; 
}
.ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
    border-right-color: ${allColor[name].border_color_3}!important; 
}
.J_Table td, .J_Table a{
    color: ${allColor[name].font_color_11}; 
}
.J_Table .ant-table-tbody td
{
    height: 32px; 
    border-right-color: ${allColor[name].border_color_3}!important; 
    border-bottom-color: ${allColor[name].border_color_3}!important; 
    transition: all .3s;
}
.J_Table .ant-table-thead th{
    height: 32px;
    padding: 0px 8px;
    border-right-color: ${allColor[name].border_color_3}!important; 
    border-top-color: ${allColor[name].border_color_3}!important; 
    border-bottom:none!important;
}

/*对话框*/
.co_modal_bg_content{
    /* border-color:rgba(63,63,63,.92); */
    /* background-color:#000; */
}
.co_modal_bg_body{
    /* background: #2D2D2D; */
}
.ant-modal-close-x {
    /* color:#fff; */
    color:${allColor[name]['font_color_4']};
}
.ant-modal-wrap{
    /* background: rgba(0,0,0,0.5); */
}
.ant-modal-close-x:hover{
    /* color:#57FEAA; */ /*color_search_del_hover */
    color:${allColor[name]['font_color_4_hover']};
}
.ant-modal-title{
    /* color:#fff!important; */
    color:${allColor[name]['font_color_10']}!important;
}
.ant-modal-content {
    /* border-color:rgba(63,63,63,.92) !important;*/ /*co_modal_bg_content */
    /* background-color:#000 !important;*/ /*co_modal_bg_content */
    /* color:#FFFFFF !important;*/ /*.co_font_modal_desc */
    background-color:${allColor[name]['bg_color_13']}!important;
}
.ant-confirm-content{/*Add by zhaosong(赵松) on 2017-3-30*/
    /* color: #ffffff!important; */
}
.ant-modal-header {
    /* background-color:transparent !important;.co_modal_bg */
    /* color: #ACACAC!important;.co_font_modal_title */
    background-color:${allColor[name]['bg_color_13']}!important;
}
.ant-modal-body{
    /* background: #2d2d2d !important;co_modal_bg_body */
    background: ${allColor[name]['bg_color_14']}!important;
}
.save_btn{
	font-size: 14px;
	float:right;
	margin-top:10px;
	display: inline-block;
    outline: 0;
    border: 0;
    text-align: center;
	line-height: 28px;
	width:140px;
    border-radius: 3px;
    background-color: ${allColor[name]['bg_color_1']};
    color: ${allColor[name]['font_color_1']};
}
.save_btn:hover{
    background-color: ${allColor[name]['bg_color_1_hover']};
    color: ${allColor[name]['font_color_1_hover']};
}

/*输入框*/
.ant-input{
    background-color: ${allColor[name]['bg_color_23']}!important;
    border-color: ${allColor[name]['border_color_8']}!important;
    color: ${allColor[name]['font_color_14']}!important;
}

/*日历选择框*/
.ant-calendar{/*co_bg_rightclick_dialog*/
    background-color:${allColor[name]['bg_color_34']}!important; 
    border-color: ${allColor[name].border_color_3} !important;
    /* background-color:rgba(35,36,39,.92) !important; */
    /* border-color:rgba(63,63,63,.92) !important; */
    /* box-shadow: 0px 0px 30px rgba(0,0,0,.15) !important; */
    /* color:rgba(255,255,255,.7) !important; */
    
}
.ant-calendar-input{
    /* background-color:rgba(35,36,39,.92) !important;co_bg_rightclick_dialog */
    /*background-color:${allColor[name]['bg_color_34']}!important; */
    background-color: ${allColor[name]['bg_color_23']}!important;
    border-color: ${allColor[name]['border_color_8']}!important;
    color: ${allColor[name]['font_color_14']}!important;
    
}

.ant-calendar-header,.ant-calendar-input-wrap,.ant-calendar-footer-btn{
    /* border-color: rgba(255,255,255,.05) !important; */
    border-color: ${allColor[name].border_color_3} !important;
}
.ant-calendar .ant-calendar-today-btn{
    /* color:#3AFFB2 !important; */
    color:${allColor[name].font_color_14} !important;
}
.ant-calendar-header a{
    color:${allColor[name].font_color_11} !important;
}
.ant-calendar-column-header span{
    color:${allColor[name].font_color_10} !important;
}
.ant-calendar-cell .ant-calendar-date{
    color:${allColor[name].font_color_11};
}
.ant-calendar-disabled-cell .ant-calendar-date{
    color:${allColor[name].font_color_6} !important;
    background-color:${allColor[name].bg_color_6} !important;
}
.ant-calendar-today .ant-calendar-date{
    color:${allColor[name].font_color_14} !important;
    border-color:${allColor[name].border_color_3}  !important;
}



.ant-calendar-selected-day .ant-calendar-date,div.ant-calendar-date[aria-selected="true"]:hover{
    background-color:${allColor[name].bg_color_7} !important;
    /*color:${allColor[name].bg_color_7} !important; */
}
.ant-calendar-date:hover{
    background-color:${allColor[name].bg_color_4} !important;
    /* background-color:transparent !important; */
    /* border-color:#3BFFB3; */
}









/*按钮*/
.ant-btn-primary {
    color:${allColor[name].font_color_1} !important;
    background-color: ${allColor[name].bg_color_1}!important;
    border: none!important;
}
.ant-btn-primary:hover{
    background-color: ${allColor[name].bg_color_1_hover}!important;
    color:${allColor[name].font_color_1_hover} !important;
}

/*滑动选择是否*/
.ant-switch-checked {
    /* border-color: #44AA76!important; */
    /* background-color: #44AA76!important; */
}

/*下拉树*/
.ant-select{
    /* color:#3BFEB3 !important;.co_font_input */
}
.ant-select-selection{
    /* background-color: rgba(0,0,0,.15) !important;.co_select_fill */
    /* border-color:#252525 !important;co_input_border */
    background-color: ${allColor[name]['bg_color_23']}!important;
    border-color: ${allColor[name]['border_color_8']}!important;
    color: ${allColor[name]['font_color_14']}!important;
}
.ant-select-arrow{
    /* color:#FFFFFF; */
}
.ant-select-arrow:before,.ant-select-tree li .ant-select-tree-node-content-wrapper:hover{
    /* background-color: transparent !important;select_right_btn */
    /* border-color:#252525 !important;co_input_border */
}
.ant-select-dropdown{/*.co_bg_rightclick_dialog*/
    background-color:${allColor[name]['bg_color_34']}!important; 
    /* border:1px solid rgba(63,63,63,.92)  !important; */
    /* box-shadow: 0px 0px 30px rgba(0,0,0,.15)  !important; */
}
.ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active{
    /* box-shadow: none !important; */
}
/*checkbox*/
.ant-checkbox-checked .ant-checkbox-inner, .ant-checkbox-indeterminate .ant-checkbox-inner {
    /* background-color: #14c066!important; */
    /* border-color: #14c066!important; */
}
.ant-select-dropdown-menu-item{
    color: ${allColor[name]['font_color_14']}!important;
}

.ant-select-dropdown-menu-item:hover,
.ant-select-dropdown-menu-item-selected,
.ant-select-dropdown-menu-item-active{
    border-radius: 2px; 
    background:${allColor[name]['bg_color_32_hover']}!important;
    color:${allColor[name]['font_color_10']}!important;
}
.ant-select-selection__placeholder,
.ant-select-search__field__placeholder{
    /* color:#8F8F8F !important; */
}




/******************下拉树的字体色************************/
/*针对老版本的下拉树设置颜色*/
.ant-select-tree li a{
  /* color:#C3C3C4 !important;co_font_rightclick */
}
.ant-select-tree li a:hover{
  /* color:#3BFFB3 !important;co_font_rightclick:hover */
}
.ant-select-dropdown-menu-item{
  /* color:#C3C3C4 !important; */
}
/*.ant-select-dropdown-menu-item:hover, .ant-select-dropdown-menu-item-active{
  color:#3BFFB3 !important;
}*/
*//*针对新版本的下拉树设置颜色*/
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-close,
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-normal,
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-open{
    display: inline-block;
    padding: 1px 5px;
    border-radius: 2px;
    margin: 0;
    cursor: pointer;
    vertical-align: top;
    transition: all 0.3s ease;
    /* color: #C3C3C4 !important; */
}
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-normal:hover,
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-close:hover,
span.ant-select-tree-node-content-wrapper.ant-select-tree-node-content-wrapper-open:hover{
    /* color: #3BFFB3 !important; */
}
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-roots_open:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-center_open:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-bottom_open:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-noline_open:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-roots_close:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-center_close:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-bottom_close:after,
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-noline_close:after{
    /* color:#C3C3C4 !important; */
}







/*select*/
.ant-select-selection-selected-value{
    /* color: #3BFEB3!important; */
}
/*textarea*/
.ant-input{
    /* background-color:rgba(0,0,0,.15) !important;/*.co_select_fill*/
    /* border-color:#252525 !important;co_input_border */
    /* color:#3BFEB3 !important;.co_font_input */
}
.ant-input[disabled]{
    /* color:#AAAAAA !important; */
}
.ant-input:focus{
    /* box-shadow: none !important; */
    /*border-color:#252525 !important;/*co_input_border*/
}
/*自定义 Tree*/
.j_right_icon{
    /* color:#C5C6C8;.co_font_table */
}
.j_grid:hover > .j_text {
  /* color: #FFFFFF !important; */
}
.j_text{
    /* color:#C6C7C8;co_font_tree */
}

/*分页*/
.ant-pagination-prev,
.ant-pagination-next,
.ant-pagination-item:not(.ant-pagination-item-active){
    /* background-color: transparent !important; */
    /* border:1px solid #4c4d4f !important;.co_page_bd */
}
.ant-pagination-prev:hover, .ant-pagination-next:hover{
    /* border:1px solid #389272 !important;.co_page_bd_hover */
}
/*.ant-select-dropdown-menu-item-selected, .ant-select-dropdown-menu-item-selected:hover
/*.ant-select-dropdown-menu-item:hover, .ant-select-dropdown-menu-item-active{
    color:#3BFFB3 !important;/*co_font_rightClick:hover*/
    /*font-weight: 400 !important;
}*/
.ant-pagination-item-active{
    /* background-color: #389272 !important; */
    /* border-color:#389272 !important; */
    /* color:#FFFFFF !important;.co_font_pageNumber_select */
}
.ant-pagination-item:not(.ant-pagination-item-active):hover{
    /* border-color:#389272 !important; */
}
.ant-pagination-prev a,
.ant-pagination-next a,
.ant-pagination-disabled a,
.ant-pagination-item:not(.ant-pagination-item-active) a{
    /* color:#C5C5C7 !important;.co_font_pageNumber */
}
.ant-pagination-prev:hover a,
.ant-pagination-next:hover a,
.ant-pagination-jump-prev:hover:after,
.ant-pagination-jump-next:hover:after,
.ant-pagination-item:not(.ant-pagination-item-active):hover a{
    /* color: #389272 !important;.co_font_pageNumber_hover */
}
/** 单选框 */
.ant-radio-inner:after{
    /* background-color: #14c066!important; */
}
.ant-radio-checked .ant-radio-inner {
    /* border-color: #14c066!important; */
}


/*antd message success提示框*/
#message_container .ant-message-notice-content{
    /* background-color:rgba(59,252,178,0.1); */
    /* box-shadow: 0 0 10px #3BFCB2 inset; */
    /* color:#3BFCB2; */
    /* padding:10px 30px 10px 11px; */
}
#message_container .ant-message-notice-content span{
    display: inline-block;
    max-width: 409px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#message_container .ant-message .anticon{
    margin-right:21px;
    /* vertical-align: super; */
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



