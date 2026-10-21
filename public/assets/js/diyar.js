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
