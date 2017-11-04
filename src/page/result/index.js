/*
* @Author: ZhangJie
* @Date:   2017-11-04 10:46:32
* @Last Modified by:   ZhangJie
* @Last Modified time: 2017-11-04 11:33:33
*/

'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

$(function(){
    var type        = _mm.getUrlParam('type') || 'default',
        $element    = $('.' + type + '-success');
    // 显示对应的提示元素
    $element.show();
})