var cookie = require('browser-cookies');

// TODO: implement it
function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

export function getProjectId() {
  return getUrlParameter('pid')
}

export function getCropImage(src, option) {
  if (src === '') return src
  let crop = option.crop, ratio = option.ratio
  if (crop) {
    src += `@${crop.l}-${crop.t}-${crop.w}-${crop.h}a`
  }
  if (ratio) {
    if (ratio.w && ratio.h) {
      src += `_${ratio.w}w_${ratio.h}`
    } else if (ratio.w) {
      src += `_${ratio.w}w`
    } else {
      src += `_${ratio.h}h`
    }
  }
  return src + '.src'
}


// TO-FIX get token from cookie
export function getToken() {
  var cookievalue=cookie.get('token');
  if(cookievalue){
    return cookievalue;
  }else{
    return 'fbc43da7-eb86-4f13-b914-f6a2695c63b2';
  }
}

