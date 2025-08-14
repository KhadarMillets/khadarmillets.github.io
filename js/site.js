
// --- Image base-name loader helpers ---
// find image by base name (tries common extensions)
function findImageSrc(baseName) {
  if (!baseName) return 'images/placeholder.jpg';
  const extensions = ['jpg','jpeg','png','webp','gif'];
  for (const ext of extensions) {
    const path = `images/${baseName}.${ext}`;
    if (imageExists(path)) return path;
  }
  // fallback: try if user provided full path already with extension
  try {
    if (imageExists(baseName)) return baseName;
  } catch (e) {}
  console.warn('Image not found for base name:', baseName);
  return 'images/placeholder.jpg';
}

function imageExists(url) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status >= 200 && xhr.status < 400;
  } catch (e) {
    return false;
  }
}

// helper to normalize image field: strip path and extension
function getImageBase(imgField) {
  if (!imgField) return '';
  var s = String(imgField);
  var parts = s.split('/');
  var name = parts[parts.length-1] || s;
  return name.replace(/\.[^.]+$/, '');
}
// --- end helpers ---



document.addEventListener('DOMContentLoaded', function(){
  // Dropdown with delay
  (function(){
    const hasDropdown = document.querySelector('.nm-has-dropdown');
    if(!hasDropdown) return;
    const btn = hasDropdown.querySelector('.nm-nav-button');
    let openTimer, closeTimer;
    const OPEN_DELAY = 160, CLOSE_DELAY = 280;
    function open(){ hasDropdown.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    function close(){ hasDropdown.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    hasDropdown.addEventListener('mouseenter', ()=>{ clearTimeout(closeTimer); openTimer = setTimeout(open, OPEN_DELAY); });
    hasDropdown.addEventListener('mouseleave', ()=>{ clearTimeout(openTimer); closeTimer = setTimeout(close, CLOSE_DELAY); });
    btn.addEventListener('click', (e)=>{ e.preventDefault(); hasDropdown.classList.toggle('open'); });
    document.addEventListener('click',(e)=>{ if(!hasDropdown.contains(e.target)) close(); });
  })();

  // mobile menu
  (function(){
    const hamb = document.querySelector('.nm-hamburger');
    const mobile = document.getElementById('mobile-menu');
    if(!hamb || !mobile) return;
    hamb.addEventListener('click', ()=>{
      const expanded = hamb.getAttribute('aria-expanded') === 'true';
      hamb.setAttribute('aria-expanded', String(!expanded));
      const hidden = mobile.getAttribute('aria-hidden') === 'true';
      mobile.setAttribute('aria-hidden', String(!hidden));
      mobile.classList.toggle('open');
    });
  })();

  // fetch products and render where appropriate
  fetch('content/products.json').then(r=>r.json()).then(data=>{
    const products = data.products || [];
    // Products page grid
    const grid = document.getElementById('nm-products-grid');
    if(grid){
      // filter buttons
      let filterBtns = Array.from(document.querySelectorAll('.nm-filter-btn'));
      // Ensure new categories exist in the filter bar even if HTML wasn't updated
      const bar = document.querySelector('.nm-filter-bar');
      const searchWrap = bar ? bar.querySelector('.nm-search-wrap') : null;
      const existingCats = new Set(filterBtns.map(b => b.dataset.cat));
      const neededCats = ["Millet Seeds", "Millet Flours"];
      neededCats.forEach(cat => {
        if (!existingCats.has(cat) && bar && searchWrap) {
          const btn = document.createElement('button');
          btn.className = 'nm-filter-btn';
          btn.dataset.cat = cat;
          btn.textContent = cat;
          bar.insertBefore(btn, searchWrap);
          // add listener now; 'renderList' and 'activeCat' are in scope
          btn.addEventListener('click', ()=>{
            activeCat = cat;
            document.querySelectorAll('.nm-filter-btn').forEach(x=>x.classList.toggle('active', x===btn));
            renderList();
          });
        }
      });
      // Refresh filterBtns to include any newly created buttons
      filterBtns = Array.from(document.querySelectorAll('.nm-filter-btn'));

      const search = document.getElementById('nm-search');
      let activeCat = 'Millets';
      const url = new URL(window.location.href);
      if(url.searchParams.get('cat')) activeCat = url.searchParams.get('cat');
      function renderList(){
        const term = (search?.value||'').trim().toLowerCase();
        let list = products.filter(p => (activeCat==='All' || p.category===activeCat));
        if(term) list = list.filter(p => (p.name+' '+p.shortDescription+' '+(p.tags||[]).join(' ')).toLowerCase().includes(term));
        if(activeCat==='All'){ list.sort((a,b)=> (a.category==='Millets' && b.category!=='Millets')?-1:(b.category==='Millets'&&a.category!=='Millets')?1:0); }
        grid.innerHTML = '';
        if(list.length===0){ grid.innerHTML = '<p style="padding:12px">No products match.</p>'; return; }
        list.forEach(p=>{ const card = document.createElement('article'); card.className='nm-product-card'; card.setAttribute('tabindex','0'); card.innerHTML = `<img src="${findImageSrc(getImageBase(p.image))}" alt="${p.name}"><div><div class="nm-product-title">${p.name}</div><div class="nm-product-price">${p.price} ${p.price_unit||''}</div><div class="nm-product-desc">${p.shortDescription}</div></div>`; grid.appendChild(card); });
      }
      filterBtns.forEach(b=>b.addEventListener('click', ()=>{ activeCat = b.dataset.cat; filterBtns.forEach(x=>x.classList.toggle('active', x===b)); renderList(); }));
      search?.addEventListener('input', renderList);
      // init buttons
      filterBtns.forEach(b=>{ if(b.dataset.cat===activeCat) b.classList.add('active'); else b.classList.remove('active'); });
      renderList();
    }

    // index featured
    const featured = document.getElementById('nm-featured-grid');
    if(featured){
      const millets = products.filter(p=>p.category==='Millets').slice(0,3);
      featured.innerHTML=''; millets.forEach(p=>{ const card = document.createElement('article'); card.className='nm-product-card'; card.innerHTML=`<img src="${findImageSrc(getImageBase(p.image))}" alt="${p.name}"><div><div class="nm-product-title">${p.name}</div><div class="nm-product-price">${p.price}</div></div><div style="margin-top:auto"><a class="nm-btn" href="products.html?cat=Millets">Shop Millets</a></div>`; featured.appendChild(card); });
    }

    // recipes sample on index
    const rSample = document.getElementById('nm-recipes-sample');
    if(rSample){
      fetch('content/recipes.json').then(r=>r.json()).then(rd=>{ const recs = rd.recipes||[]; rSample.innerHTML=''; recs.slice(0,3).forEach(r=>{ const el = document.createElement('article'); el.className='nm-product-card'; el.innerHTML = `<img src="${findImageSrc(getImageBase(r.image))}" alt="${r.title}"><div><div class="nm-product-title">${r.title}</div><div class="nm-product-desc">${r.shortDescription}</div></div><div style="margin-top:auto"><a class="nm-btn" href="recipes.html">View</a></div>`; rSample.appendChild(el); }); }).catch(()=>{ rSample.innerHTML=''; });
    }

    // recipes page
    const rGrid = document.getElementById('nm-recipes-grid');
    if(rGrid){
      fetch('content/recipes.json').then(r=>r.json()).then(rd=>{ const recs = rd.recipes||[]; rGrid.innerHTML=''; recs.forEach(r=>{ const el = document.createElement('article'); el.className='nm-product-card'; el.innerHTML = `<img src="${findImageSrc(getImageBase(r.image))}" alt="${r.title}"><div><div class="nm-product-title">${r.title}</div><div class="nm-product-desc">${r.shortDescription}</div><details><summary>Recipe</summary><ol>${r.steps.map(s=>'<li>'+s+'</li>').join('')}</ol></details></div>`; rGrid.appendChild(el); }); }).catch(()=>{ rGrid.innerHTML='<p>No recipes found.</p>'; });
    }

    // testimonials page
    const tGrid = document.getElementById('nm-testimonials-grid');
    if(tGrid){
      fetch('content/testimonials.json').then(r=>r.json()).then(td=>{ const t = td.testimonials||[]; tGrid.innerHTML=''; t.forEach(tt=>{ const el = document.createElement('article'); el.className='nm-product-card'; el.innerHTML = `<img src="${findImageSrc(getImageBase(tt.avatar))}" alt="${tt.name}" style="height:96px;object-fit:cover;border-radius:8px"><div><div class="nm-product-title">${tt.name} — ${tt.location}</div><div class="nm-product-desc">&ldquo;${tt.quote}&rdquo;</div></div>`; tGrid.appendChild(el); }); }).catch(()=>{ tGrid.innerHTML='<p>No testimonials found.</p>'; });
    }
  }).catch(err=>{ console.warn('Products fetch failed', err); });

  // contact form handling
  const form = document.getElementById('nm-contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name')||''; const email = fd.get('email')||''; const phone = fd.get('phone')||''; const message = fd.get('message')||'';
      if(!name||!email||!phone||!message){ alert('Please fill all fields'); return; }
      // mailto fallback
      const body = encodeURIComponent('Name: '+name+'\nPhone: '+phone+'\nMessage: '+message);
      window.location.href = `mailto:khadarmillets@gmail.com?subject=${encodeURIComponent('Website Contact from '+name)}&body=${body}`;
      form.reset();
    });
  }
});
