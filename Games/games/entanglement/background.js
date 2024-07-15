chrome.app.runtime.onLaunched.addListener(function() {
  var lang = chrome.i18n.getMessage("@@ui_locale").replace('_', '-');
  switch(lang){
  case 'pt-PT':
  case 'ro':
  case 'ru':
  case 'sk':
  case 'sl':
  case 'sr':
  case 'sv':
  case 'th':
  case 'tr':
  case 'uk':
  case 'vi':
  case 'zh-CN':
  case 'zh-TW':
  case 'bg':
  case 'ca':
  case 'cs':
  case 'da':
  case 'de':
  case 'el':
  case 'en-GB':
  case 'en-US':
  case 'es':
  case 'es-419':
  case 'et':
  case 'fi':
  case 'fil':
  case 'fr':
  case 'hi':
  case 'hr':
  case 'hu':
  case 'id':
  case 'it':
  case 'ja':
  case 'ko':
  case 'lt':
  case 'lv':
  case 'nb':
  case 'nl':
  case 'pl':
  case 'pt-BR':
	  break;
  default:
	  lang = 'en-US';
  }
  chrome.app.window.create(lang + '-index.html', {
    "id": "Entanglement-Loader",
    "bounds": {
      "width": 1024,
      "height": 768
    }
  });
});