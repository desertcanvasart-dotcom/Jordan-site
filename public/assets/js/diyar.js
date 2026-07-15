// Diyar shared
(function(){var items=document.querySelectorAll('.reveal');
if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(function(el){el.classList.add('in');});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
items.forEach(function(el){var p=el.previousElementSibling;el.style.transitionDelay=(p&&p.classList.contains('reveal')?80:0)+'ms';io.observe(el);});})();
(function(){var f=document.getElementById('planForm');if(!f)return;var N='962700000000';
f.addEventListener('submit',function(e){e.preventDefault();var g=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
if(!g('name')||!g('wa')){(document.getElementById(!g('name')?'name':'wa')).focus();return;}
var m='Hello Diyar, I would like to plan a Jordan trip.%0A%0AName: '+encodeURIComponent(g('name'))+'%0AWhatsApp: '+encodeURIComponent(g('wa'))+'%0ADates: '+encodeURIComponent(g('dates')||'-')+'%0ATravelers: '+encodeURIComponent(g('travelers')||'-')+'%0ATrip: '+encodeURIComponent(g('escape'))+'%0ALanguage: '+encodeURIComponent(g('lang'));
window.open('https://wa.me/'+N+'?text='+m,'_blank');});})();
