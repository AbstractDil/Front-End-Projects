/**
 * assessment-autosave.js
 *
 * Local-first answer persistence for the exam window.
 *
 * - Every "Save & Next" / "Mark for Review" / "Clear" action writes to
 *   localStorage IMMEDIATELY, so a crash or closed tab never loses an
 *   answer, even with no internet at all.
 * - Changes are batched and sent to the server on a timer (not on every
 *   click) via a single POST containing everything unsynced.
 * - If offline, changes just stay queued in localStorage; a browser
 *   'online' event or the next timer tick flushes them.
 * - On page load, hydrate() pulls already-saved answers from the server
 *   (covers a fresh browser / different device) and merges them with
 *   anything still sitting unsynced in localStorage.
 * - Remaining exam seconds are persisted the same way, so a refresh
 *   resumes the countdown instead of restarting it.
 *
 * Usage (see assessment.php patch notes):
 *
 *   Autosave.init({
 *     examToken: '...',
 *     saveUrl:   '/TS_Exam_Action/save_batch_responses/<token>',
 *     fetchUrl:  '/TS_Exam_Action/get_saved_responses/<token>',
 *     syncIntervalMs: 8000,
 *     getRemainingSeconds: function(){ return window.currentRemainingSeconds; }
 *   });
 *
 *   Autosave.queue(quesNo);           // call after Save&Next / Mark / Clear
 *   Autosave.hydrate(applyCallback);  // call once on load, after panels exist
 */
window.Autosave = (function () {
    'use strict';

    var config = {};
    var state = { responses: {}, dirty: [] };
    var storageKey = '';
    var debounceTimer = null;
    var intervalId = null;
    var syncing = false;

    function log() {
        if (config.debug) {
            console.log.apply(console, ['[Autosave]'].concat(Array.prototype.slice.call(arguments)));
        }
    }

    function persist() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (e) {
            console.warn('[Autosave] localStorage write failed (quota or private mode?)', e);
        }
    }

    function loadPersisted() {
        try {
            var raw = localStorage.getItem(storageKey);
            if (raw) {
                var parsed = JSON.parse(raw);
                return {
                    responses: parsed.responses || {},
                    dirty: parsed.dirty || []
                };
            }
        } catch (e) {
            console.warn('[Autosave] localStorage read failed, starting fresh', e);
        }
        return { responses: {}, dirty: [] };
    }

    // Reads the current answer + status for a question number directly
    // from the DOM. Keeps this module decoupled from the exam.js internals —
    // it doesn't need to know section/set tracking logic, just the panel markup.
    function readQuestionData(quesNo) {
        var panel = document.getElementById('Q' + quesNo);
        if (!panel) {
            log('No panel found for question', quesNo);
            return null;
        }

        var quesIdInput = panel.querySelector('input[name="ques_id[]"]');
        var examIdInput = panel.querySelector('input[name="exam_id[]"]');
        var candIdInput = panel.querySelector('input[name="candidate_id[]"]');
        var secIdInput = panel.querySelector('input[name="sec_id[]"]');
        var setIdInput = panel.querySelector('input[name="set_id[]"]');
        var statusInput = document.getElementById('quesStatus' + quesNo);

        if (!quesIdInput || !statusInput) {
            log('Missing required fields for question', quesNo);
            return null;
        }

        var checked = panel.querySelector('input[name="choosen_option_' + quesNo + '"]:checked');

        return {
            ques_id: quesIdInput.value,
            exam_id: examIdInput ? examIdInput.value : config.examId,
            candidate_id: candIdInput ? candIdInput.value : config.candidateId,
            sec_id: secIdInput ? secIdInput.value : null,
            set_id: setIdInput ? setIdInput.value : null,
            ques_status: parseInt(statusInput.value, 10),
            choosen_option: checked ? checked.value : '0'
        };
    }

    function scheduleSync() {
        // Debounce quick successive actions (e.g. rapid Save & Next clicks)
        // into one request, but the periodic interval below is the real
        // safety net that guarantees a flush even if the user never pauses.
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(syncNow, 2500);
    }

    function syncNow() {
        if (state.dirty.length === 0) {
            return;
        }
        if (!navigator.onLine) {
            log('Offline — ' + state.dirty.length + ' change(s) queued locally');
            return;
        }
        if (syncing) {
            return; // avoid overlapping requests; next interval tick will retry
        }

        syncing = true;
        var toSync = state.dirty.slice();

        var payload = {
            responses: toSync.map(function (qid) { return state.responses[qid]; }),
            remaining_seconds: (typeof config.getRemainingSeconds === 'function') ? config.getRemainingSeconds() : null
        };

        fetch(config.saveUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (res) { return res.json(); })
            .then(function (json) {
                syncing = false;
                if (json && json.status === 'ok') {
                    state.dirty = state.dirty.filter(function (qid) {
                        return toSync.indexOf(qid) === -1;
                    });
                    persist();
                    log('Synced', toSync.length, 'response(s)');
                } else {
                    log('Server rejected sync, will retry', json);
                }
            })
            .catch(function (err) {
                syncing = false;
                log('Sync request failed, will retry on next tick', err);
                // Deliberately leave items in state.dirty — nothing lost.
            });
    }

    return {
        init: function (opts) {
            config = Object.assign({ syncIntervalMs: 8000, debug: false }, opts);
            storageKey = 'examProgress_' + config.examToken;
            state = loadPersisted();

            intervalId = setInterval(syncNow, config.syncIntervalMs);

            window.addEventListener('online', function () {
                log('Back online — flushing queued changes');
                syncNow();
            });

            // Best-effort flush when the tab is closed/backgrounded.
            // sendBeacon can't confirm success, so we don't clear the
            // dirty queue here — if it silently fails, the next page
            // load's hydrate() plus the still-queued localStorage data
            // covers it.
            window.addEventListener('pagehide', function () {
                if (state.dirty.length === 0) return;
                var payload = JSON.stringify({
                    responses: state.dirty.map(function (qid) { return state.responses[qid]; }),
                    remaining_seconds: (typeof config.getRemainingSeconds === 'function') ? config.getRemainingSeconds() : null
                });
                try {
                    navigator.sendBeacon(config.saveUrl, new Blob([payload], { type: 'application/json' }));
                } catch (e) {
                    // ignore — best effort only
                }
            });

            log('Initialized with', state.dirty.length, 'pending change(s) from previous session');
        },

        // Call this right after Save & Next / Mark for Review / Clear
        // Response finish updating the DOM for a question.
        queue: function (quesNo) {
            var data = readQuestionData(quesNo);
            if (!data) return;

            state.responses[data.ques_id] = data;
            if (state.dirty.indexOf(data.ques_id) === -1) {
                state.dirty.push(data.ques_id);
            }
            persist();
            scheduleSync();
        },

        // Call once, after question panels + palette buttons exist in the DOM.
        // Merges server-confirmed answers with anything still-unsynced locally
        // (local wins on conflict, since it may be newer than the last sync),
        // then hands the merged map + remaining_seconds to applyCallback so
        // the caller can paint the DOM (checked radios, status classes, timer).
        hydrate: function (applyCallback) {
            fetch(config.fetchUrl)
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    var serverResponses = (json && json.responses) || [];
                    serverResponses.forEach(function (r) {
                        if (!state.responses[r.ques_id]) {
                            state.responses[r.ques_id] = {
                                ques_id: r.ques_id,
                                sec_id: r.sec_id,
                                set_id: r.set_id,
                                ques_status: parseInt(r.ques_status, 10),
                                choosen_option: r.choosen_option,
                                exam_id: config.examId,
                                candidate_id: config.candidateId
                            };
                        }
                    });
                    persist();
                    if (typeof applyCallback === 'function') {
                        applyCallback(state.responses, (json && json.remaining_seconds !== undefined) ? json.remaining_seconds : null);
                    }
                })
                .catch(function (err) {
                    console.warn('[Autosave] Hydrate failed — resuming from local cache only', err);
                    if (typeof applyCallback === 'function') {
                        applyCallback(state.responses, null);
                    }
                });
        },

        getLocalResponses: function () { return state.responses; },
        forceSyncNow: syncNow
    };
})();
