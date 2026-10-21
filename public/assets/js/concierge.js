(function () {
  'use strict';
  var root = document.getElementById('concierge-data');
  if (!root) return;
  var data = JSON.parse(root.textContent), ar = data.locale === 'ar';
  var t = function (en, arabic) { return ar ? arabic : en; };
  var form = document.getElementById('tripComposer');
  var params = new URLSearchParams(location.search);
  ['who', 'days', 'pace', 'tier'].forEach(function (name) {
    var input = Array.from(form.elements).find(function (el) { return el.name === name && el.value === params.get(name); });
    if (input) input.checked = true;
  });
  params.getAll('need').forEach(function (value) {
    Array.from(form.elements).forEach(function (el) { if (el.name === 'need' && el.value === value) el.checked = true; });
  });
  function element(tag, text) { var el = document.createElement(tag); el.textContent = text; return el; }
  function selected(name) { return Number(form.querySelector('input[name="' + name + '"]:checked').value); }
  function routeFor(days, pace, tier) {
    if (days === 5 && tier === 1) return ['amman','rum','rum','deadsea','amman'];
    if (days === 3) return pace === 0 ? ['amman','deadsea','amman'] : ['amman','petra','amman'];
    if (days === 5) return pace === 0 ? ['amman','petra','petra','deadsea','amman'] : ['amman','petra','rum','deadsea','amman'];
    if (days === 7) return ['amman','jerash','petra','petra','rum','deadsea','amman'];
    return ['amman','jerash','amman','petra','petra','rum','rum','aqaba','deadsea','amman'];
  }
  function priceFor(key, tier) {
    var price = (data.settings.prices[key] || {})[tier];
    if (!price || !(price.amount > 0) || !price.currency || !price.basis) return t('Tailored quote on request','عرض سعر مخصص عند الطلب');
    return t('From ','ابتداءً من ') + new Intl.NumberFormat(ar ? 'ar' : 'en', {style:'currency',currency:price.currency,maximumFractionDigits:0}).format(price.amount) + ' · ' + (price.basis[ar?'ar':'en'] || '');
  }
  function mapRoute(route, label) {
    document.getElementById('route-title').textContent=label || t('Your starting plan','فكرة رحلتك');
    var unique = route.filter(function (p,i) { return i === 0 || p !== route[i-1]; });
    document.getElementById('route-line').setAttribute('d', unique.map(function (key,i) { var p=data.places[key]; return (i?'L':'M')+p.x+' '+p.y; }).join(' '));
    document.querySelectorAll('[data-map-stop]').forEach(function (el) { el.classList.toggle('active', route.indexOf(el.dataset.mapStop) >= 0); });
    var legs = document.getElementById('route-legs'); legs.replaceChildren();
    for (var i=1;i<unique.length;i++) {
      var from=unique[i-1], to=unique[i], mins=data.settings.driveMinutes[from+'-'+to] || data.settings.driveMinutes[to+'-'+from];
      legs.append(element('p',data.places[from].name+' → '+data.places[to].name+(mins?' · '+t('approx. ','نحو ')+mins+t(' min',' دقيقة'):'')));
    }
  }
  function updateComposer(writeUrl) {
    var who=selected('who'), days=[3,5,7,10][selected('days')], pace=selected('pace'), tier=selected('tier');
    var route=routeFor(days,pace,tier), result=document.getElementById('composer-result'); result.replaceChildren();
    result.append(element('p',data.groups[who]+' · '+days+t(' days',' أيام')+' · '+[t('Relaxed','هادئة'),t('Balanced','متوازنة'),t('Full','مكثفة')][pace]));
    if(who===1||who===3) result.append(element('p',t('We suggest regular comfort stops and a review of walking distances for your group.','نقترح استراحات منتظمة ومراجعة مسافات المشي بما يناسب مجموعتكم.')));
    var routeText=route.filter(function (p,i) { return i===0||p!==route[i-1]; }).map(function (p) { return data.places[p].name; }).join(' → ');
    result.append(element('p',routeText));
    var nights={}; route.slice(0,-1).forEach(function (p) { nights[p]=(nights[p]||0)+1; });
    result.append(element('p',Object.keys(nights).map(function (p) { return data.places[p].name+': '+nights[p]+t(' night(s)',' ليلة'); }).join(' · ')));
    result.append(element('p',pace===0?t('Fewer hotel changes, longer pauses and flexible mornings.','تغييرات أقل للفنادق ووقت أطول للراحة وصباحات مرنة.'):pace===1?t('A mix of discovery, rest and time to enjoy each stop.','مزيج من الاكتشاف والراحة ووقت للاستمتاع بكل محطة.'):t('More variety each day; expect longer travel and walking days.','تنوع أكبر كل يوم؛ توقع أياماً أطول للقيادة والمشي.')));
    var needs=Array.from(form.querySelectorAll('[name="need"]:checked')).map(function (el) { return Number(el.value); });
    needs.forEach(function (i) { result.append(element('p',data.adaptations[i])); });
    document.querySelectorAll('[data-trip-adaptations]').forEach(function(el){el.textContent=needs.map(function(i){return data.adaptations[i];}).join(' ');});
    var key=days===3?'weekend-escape':days===5?(tier===1?'luxury-desert-dead-sea':'family-journey'):'full-jordan-journey';
    result.append(element('p',priceFor(key,tier===1?'luxury':'boutique')));
    var query=new URLSearchParams(); ['who','days','pace','tier'].forEach(function (name) { query.set(name,String(selected(name))); }); needs.forEach(function(i){query.append('need',String(i));});
    var refine=document.getElementById('composer-refine'); refine.href='/'+data.locale+'/plan-your-trip?'+query.toString();
    var lines=[t('Hello Diyar, here is my Jordan trip idea:','مرحباً ديار، هذه فكرة رحلتي إلى الأردن:'),data.groups[who],days+t(' days',' أيام'),[t('Relaxed','هادئة'),t('Balanced','متوازنة'),t('Full','مكثفة')][pace],tier===1?t('Luxury','فاخرة'):t('Boutique','بوتيك'),routeText];
    needs.forEach(function(i){lines.push(data.needs[i]);});
    var send=document.getElementById('composer-send');
    send.href=data.whatsapp?'https://wa.me/'+data.whatsapp+'?text='+encodeURIComponent(lines.join('\n')):refine.href;
    if (!data.whatsapp) { send.textContent=t('Save and refine this plan','احفظ الفكرة وأكملها'); }
    if(writeUrl) history.replaceState(null,'',location.pathname+'?'+query.toString()+location.hash);
    mapRoute(route);
  }
  form.addEventListener('submit',function(e){e.preventDefault();});
  form.addEventListener('change',function(){updateComposer(true);});
  document.querySelectorAll('[data-journey]').forEach(function(detail){
    var trip=data.trips.find(function(x){return x.key===detail.dataset.journey;});
    var slider=detail.querySelector('[data-day-slider]');
    function updateDay(){
      var day=Number(slider.value), place=data.places[trip.route[day-1]], tier=detail.querySelector('[data-trip-tier]').value;
      detail.querySelector('[data-day-number]').textContent=String(day);
      var img=detail.querySelector('[data-day-image]'); img.src='/assets/img/'+place.image+'.webp';img.alt=place.name;img.removeAttribute('srcset');
      var copy=detail.querySelector('[data-day-copy]');var dayContent=trip.days[day-1];
      copy.replaceChildren(element('h3',t('Day ','اليوم ')+day+' · '+dayContent.name),element('p',dayContent.description));
      var hotel=((data.settings.hotelOptions[trip.key]||{})[tier]||{});
      copy.append(element('p',hotel.name|| (tier==='luxury'?t('Luxury stay requested; property confirmed in your proposal.','إقامة فاخرة مطلوبة؛ يؤكد مكان الإقامة في العرض.'):t('Boutique stay requested; property confirmed in your proposal.','إقامة بوتيك مطلوبة؛ يؤكد مكان الإقامة في العرض.'))));
      if(hotel.image && /^\/assets\//.test(hotel.image))img.src=hotel.image;
      detail.querySelector('[data-trip-price]').textContent=priceFor(trip.key,tier);
      if(detail.open)mapRoute(trip.route,trip.name);
    }
    slider.addEventListener('input',updateDay);detail.querySelector('[data-trip-tier]').addEventListener('change',updateDay);
    detail.addEventListener('toggle',function(){if(detail.open){document.querySelectorAll('[data-journey]').forEach(function(other){if(other!==detail)other.open=false;});updateDay();}});
    detail.addEventListener('pointerenter',function(){mapRoute(trip.route,trip.name);});
    detail.addEventListener('focusin',function(){mapRoute(trip.route,trip.name);});updateDay();
  });
  document.querySelectorAll('[data-trip-focus]').forEach(function(card){
    var trip=data.trips.find(function(x){return x.key===card.dataset.tripFocus;});
    card.addEventListener('pointerenter',function(){mapRoute(trip.route,trip.name);});
    card.addEventListener('focus',function(){mapRoute(trip.route,trip.name);});
    card.addEventListener('click',function(){document.getElementById('journey-'+trip.key).open=true;});
  });
  var month=document.getElementById('travel-month');
  function updateSeason(){
    var m=Number(month.value),panel=document.getElementById('season-advice');panel.replaceChildren();
    panel.append(element('h3',month.options[month.selectedIndex].text));
    panel.append(element('p',[12,1,2].includes(m)?t('Highlands and desert nights can be cold. Plan layers and flexible outdoor days; the Jordan Valley is generally warmer.','قد تكون المرتفعات وليالي الصحراء باردة. جهز طبقات ملابس وأياماً خارجية مرنة؛ يكون وادي الأردن أدفأ عادةً.'):[6,7,8].includes(m)?t('Summer can be very hot, especially in the desert and Jordan Valley. Favor shaded breaks and shorter outdoor sessions.','قد يكون الصيف شديد الحرارة، خاصة في الصحراء ووادي الأردن. فضل استراحات الظل والفترات الخارجية الأقصر.'):t('A transition season: allow for regional differences, changing weather and cooler desert evenings.','موسم انتقالي: راع اختلاف المناطق وتقلب الطقس وبرودة أمسيات الصحراء.')));
    var holiday=document.querySelector('[name="holiday"]:checked');
    if(holiday){panel.append(element('p',t('For a short break, start with 3 or 5 days; for a longer holiday, consider 7 or 10. Share exact school dates and check availability early.','لعطلة قصيرة ابدأ بـ٣ أو ٥ أيام، ولإجازة أطول اختر ٧ أو ١٠. شارك مواعيد المدرسة الدقيقة وتحقق من التوافر مبكراً.')));document.querySelectorAll('[data-journey]').forEach(function(el){el.classList.toggle('holiday-fit',holiday.value!=='3'&&el.querySelector('[data-day-slider]').max<=5);});}
  }
  month.addEventListener('change',updateSeason);document.querySelectorAll('[name="holiday"]').forEach(function(el){el.addEventListener('change',updateSeason);});updateSeason();
  var cancel=document.getElementById('cancel-days');
  function updateRefund(){
    var days=Number(cancel.value);document.getElementById('cancel-count').textContent=String(days);
    var band=data.settings.refundBands.filter(function(b){return days>=b.minDays;}).sort(function(a,b){return b.minDays-a.minDays;})[0];
    document.getElementById('refund-result').textContent=band?t('Indicative refund: ','استرداد إرشادي: ')+band.percent+'% · '+t('Only the agreed written booking terms apply.','تطبق شروط الحجز المكتوبة المتفق عليها فقط.'):t('A refund percentage cannot be quoted without your agreed supplier and booking terms. Ask for the cancellation schedule before paying.','لا يمكن تحديد نسبة الاسترداد دون شروط المورد والحجز المتفق عليها. اطلب جدول الإلغاء قبل الدفع.');
  }
  cancel.addEventListener('input',updateRefund);updateRefund();
  var person=data.settings.person;
  if(person && person.name && person.image && /^\/assets\//.test(person.image)){
    document.getElementById('concierge-name').textContent=person.name;
    var avatar=document.querySelector('.concierge-monogram'),photo=document.createElement('img');photo.src=person.image;photo.alt=person.name;photo.width=160;photo.height=160;photo.loading='lazy';avatar.replaceChildren(photo);
  }
  var hours=data.settings.workingHours;
  if(hours && Array.isArray(hours.weekdays)){
    var parts=new Intl.DateTimeFormat('en',{timeZone:'Asia/Amman',weekday:'short',hour:'numeric',hourCycle:'h23'}).formatToParts(new Date());
    var hour=Number(parts.find(function(p){return p.type==='hour';}).value),weekday=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.find(function(p){return p.type==='weekday';}).value);
    var online=hours.weekdays.includes(weekday)&&hour>=hours.start&&hour<hours.end;
    document.getElementById('concierge-hours').textContent=online?t('Within published contact hours in Amman.','ضمن ساعات التواصل المنشورة بتوقيت عمّان.')+(data.settings.replyMinutes?t(' Typical reply: ',' الرد المعتاد: ')+data.settings.replyMinutes+t(' minutes.',' دقيقة.'):''):t('Outside contact hours. Next opening: ','خارج ساعات التواصل. بداية الدوام التالية: ')+hours.start+':00 '+t('on the next working day, Amman time.','في يوم العمل التالي، بتوقيت عمّان.');
  }
  var sticky=document.querySelector('.sticky-whatsapp');
  if(sticky && 'IntersectionObserver' in window)new IntersectionObserver(function(entries){sticky.classList.toggle('visible',!entries[0].isIntersecting);}).observe(document.querySelector('.hero'));
  updateComposer(false);
  var initialJourney=data.trips.find(function(trip){return document.getElementById('journey-'+trip.key).open;});
  if(initialJourney)mapRoute(initialJourney.route,initialJourney.name);
})();
