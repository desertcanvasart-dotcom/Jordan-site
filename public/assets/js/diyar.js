// Diyar shared
(function(){var items=document.querySelectorAll('.reveal');
if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(function(el){el.classList.add('in');});return;}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
items.forEach(function(el){var p=el.previousElementSibling;el.style.transitionDelay=(p&&p.classList.contains('reveal')?80:0)+'ms';io.observe(el);});})();
(function () {
  var form = document.getElementById('planForm');
  if (!form) return;
  var arabic = document.documentElement.lang === 'ar';
  var number = form.getAttribute('data-whatsapp');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var status = document.getElementById('form-status');
    if (!number) {
      if (status) status.textContent = arabic ? 'الاستفسارات غير متاحة بعد. ننتظر تأكيد رقم التواصل.' : 'Inquiries are not available yet. The operator contact number is awaiting confirmation.';
      return;
    }
    function value(id) {
      var field = document.getElementById(id);
      return field ? field.value.trim() : '';
    }
    if (!value('name') || !value('wa')) {
      document.getElementById(!value('name') ? 'name' : 'wa').focus();
      return;
    }
    var labels = arabic
      ? ['الاسم', 'رقم واتساب', 'مواعيد السفر', 'المسافرون', 'الرحلة', 'اللغة']
      : ['Name', 'WhatsApp', 'Dates', 'Travelers', 'Trip', 'Language'];
    var fields = ['name', 'wa', 'dates', 'travelers', 'escape', 'lang'];
    var intro = arabic ? 'مرحباً ديار، أود التخطيط لرحلة في الأردن.' : 'Hello Diyar, I would like to plan a Jordan trip.';
    var message = intro + '\n\n' + fields.map(function (id, index) {
      return labels[index] + ': ' + (value(id) || '-');
    }).join('\n');
    var savedIdea = document.getElementById('savedTripIdea');
    if (savedIdea) message += '\n\n' + savedIdea.value;
    window.location.assign('https://wa.me/' + number + '?text=' + encodeURIComponent(message));
  });
})();

// This is a non-modal disclosure: Tab follows normal document order.
(function () {
  document.querySelectorAll('[data-mobile-menu]').forEach(function (menu) {
    var summary = menu.querySelector('summary');
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        summary.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { menu.open = false; });
    });
    matchMedia('(min-width: 1041px)').addEventListener('change', function (event) {
      if (event.matches) menu.open = false;
    });
  });
})();

// Carry the homepage's shareable preferences into the full inquiry form.
(function () {
  var box = document.getElementById('saved-trip-idea');
  if (!box) return;
  var params = new URLSearchParams(location.search), ar = document.documentElement.lang === 'ar';
  var groups = ar ? ['زوجان','عائلة مع أطفال صغار','عائلة مع مراهقين','ثلاثة أجيال','أصدقاء'] : ['Couple','Family with young kids','Family with teens','Three generations','Friends'];
  var days = [3,5,7,10], paces = ar ? ['هادئة','متوازنة','مكثفة'] : ['Relaxed','Balanced','Full'];
  if (!params.has('who')) return;
  function index(name, max) { var value = params.get(name); return /^\d+$/.test(value || '') && Number(value) <= max ? Number(value) : 0; }
  var text = (ar ? 'فكرة رحلتك: ' : 'Your trip idea: ') + groups[index('who',4)] + ' · ' + days[index('days',3)] + (ar ? ' أيام · ' : ' days · ') + paces[index('pace',2)] + ' · ' + (index('tier',1) ? (ar ? 'فاخرة' : 'Luxury') : (ar ? 'بوتيك' : 'Boutique'));
  var needs = ar ? ['أطفال دون ٦ سنوات','مشي محدود','طعام حلال','مراعاة الصلاة','طلب مرشدة','غرف متصلة / فيلا'] : ['Kids under 6','Limited walking','Halal dining','Prayer-aware pacing','Female guide request','Connecting rooms / villa'];
  params.getAll('need').forEach(function (v) { if (/^[0-5]$/.test(v)) text += ' · ' + needs[Number(v)]; });
  box.textContent = text;
  var field = document.createElement('input'); field.type = 'hidden'; field.id = 'savedTripIdea'; field.value = text; document.getElementById('planForm').append(field);
  var trip = document.getElementById('escape');
  if (trip) trip.selectedIndex = days[index('days',3)] === 3 ? 0 : days[index('days',3)] === 5 ? (index('tier',1) ? 2 : 1) : days[index('days',3)] === 7 ? 3 : 4;
})();
