window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init();
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
  if(!a||!window.plausible)return;
  var h=a.getAttribute('href')||'',n=null;
  if(h.indexOf('tel:')===0)n='Call';
  else if(h.indexOf('sms:')===0)n='Text';
  else if(h.indexOf('mailto:')===0)n='Email';
  else if(/^\/?contact(\.html)?(#|\?|$)/.test(h))n='Message Click';
  if(n)window.plausible(n);
});
