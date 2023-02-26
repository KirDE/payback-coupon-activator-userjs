// ==UserScript==
// @name           PayBack coupon activator
// @id             payback-coupon-activator
// @category       Misc
// @version        0.1
// @author         KirillDE
// @description    Activate all Payback coupons
// @match          https://payback.de/*
// @match          https://www.payback.de/*
// @grant          none
// ==/UserScript==


function wrapper(pluginInfo) {
    setTimeout(activate, 5000);
    
}

function activate() {
    let couponCenter = document.querySelector('pb-coupon-center');
    let couponCenterRoot = couponCenter && couponCenter.shadowRoot;
    for (var coupon of couponCenterRoot.querySelectorAll('pbc-coupon')) {
        let couponRoot = coupon && coupon.shadowRoot;
        for (var couponAction of couponRoot.querySelectorAll('pbc-coupon-call-to-action')) {
            let couponActionRoot = couponAction && couponAction.shadowRoot;
            couponActionRoot.querySelector('.not-activated') && couponActionRoot.querySelector('.not-activated').click();
        }
    }
}

((() => {
  const pluginInfo = {};
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    pluginInfo.script = {
      version: GM_info.script.version,
      name: GM_info.script.name,
      description: GM_info.script.description,
    };
  }
  // Greasemonkey. It will be quite hard to debug
  if (typeof unsafeWindow !== 'undefined' || typeof GM_info === 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
    // inject code into site context
    const script = document.createElement('script');
    script.appendChild(document.createTextNode(`(${wrapper})(${JSON.stringify(pluginInfo)});`));
    (document.body || document.head || document.documentElement).appendChild(script);
  } else {
    // Tampermonkey, run code directly
    wrapper(pluginInfo);
  }
})());
