// ==UserScript==
// @name           PayBack coupon activator
// @id             payback-coupon-activator
// @category       Misc
// @version        0.2
// @updateURL      https://github.com/KirDE/payback-coupon-activator-userjs/raw/main/payback-coupon-activator.user.js
// @downloadURL    https://github.com/KirDE/payback-coupon-activator-userjs/raw/main/payback-coupon-activator.user.js
// @author         KirillDE
// @description    Activate all Payback coupons
// @match          https://payback.de/*
// @match          https://www.payback.de/*
// @grant          none
// ==/UserScript==

(function() {
    'use strict';

    // ==================== GLOBAL CONFIG ====================
    const CONFIG = {
        DEBUG_STATUS: false,
        BATCH_SIZE: 50,
        CLICK_DELAY: 500,
        TEXT_FILTERS: [
            'JETZT TEILNEHMEN',
            'Jetzt aktivieren',
            ''
        ],
        AUTO_RELOAD: true, // Reload only if coupons remain
        RELOAD_DELAY: 2000 // ms before reload
    };

    function log(msg, data) {
        if (CONFIG.DEBUG_STATUS) console.log(`[GLOBAL] ${msg}`, data || '');
    }

    function activateAll() {
        log('GLOBAL SCAN START');

        const allButtons = document.querySelectorAll('button[data-testid$="-not_activated"]');
        const totalFound = allButtons.length;

        log(`[GLOBAL] Found ${totalFound} activatable buttons`);

        if (totalFound === 0) {
            log('[GLOBAL] No more coupons to activate');
            return;
        }

        let activatedCount = 0;
        let filteredCount = 0;

        function processNext() {
            if (activatedCount + filteredCount >= CONFIG.BATCH_SIZE ||
                activatedCount + filteredCount >= totalFound) {

                const totalProcessed = activatedCount + filteredCount;
                log(`[GLOBAL] Processed ${totalProcessed}/${totalFound} | Activated: ${activatedCount}`);

                // SMART RELOAD: Only if coupons remain AFTER batch
                const remaining = totalFound - totalProcessed;
                if (CONFIG.AUTO_RELOAD && remaining > 0) {
                    log(`[GLOBAL] ${remaining} coupons left → Reloading in ${CONFIG.RELOAD_DELAY/1000}s`);
                    setTimeout(() => location.reload(), CONFIG.RELOAD_DELAY);
                } else {
                    log('[GLOBAL] All processed or batch complete - No reload needed');
                }
                return;
            }

            const btn = allButtons[activatedCount + filteredCount];
            const testid = btn.getAttribute('data-testid');
            const text = btn.textContent.trim();

            // Text filter
            const passesFilter = CONFIG.TEXT_FILTERS.length === 0 ||
                  CONFIG.TEXT_FILTERS.some(filter => text.includes(filter) || filter === '');

            if (passesFilter) {
                // Activate
                btn.click();
                activatedCount++;

                log(`\r ${activatedCount}/${Math.min(CONFIG.BATCH_SIZE, totalFound)}`);
            } else {
                filteredCount++;
                log(`Filtered: "${text}"`);
            }

            setTimeout(processNext, CONFIG.CLICK_DELAY);
        }

        processNext();
    }

    log('Config:', CONFIG);

    setTimeout(activateAll, 2000);
    setInterval(activateAll, 86400000);
})();
