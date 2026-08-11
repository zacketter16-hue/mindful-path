/*
 * Per-member saved state, stored in Memberstack's built-in member JSON.
 * One JSON object per member — add new keys freely (favorites, playbook order, etc.)
 * without any schema or table changes.
 */
window.MFLState = (function () {
  function sdk() {
    return window.$memberstackDom;
  }

  function ready(attempts) {
    return new Promise(function (resolve) {
      (function poll(n) {
        if (sdk()) return resolve(sdk());
        if (n >= (attempts || 50)) return resolve(null);
        setTimeout(function () { poll(n + 1); }, 100);
      })(0);
    });
  }

  function get() {
    return ready().then(function (ms) {
      if (!ms) return {};
      return ms.getMemberJSON()
        .then(function (res) { return (res && res.data) || {}; })
        .catch(function () { return {}; });
    });
  }

  // Merges a patch into existing state so concurrent features don't clobber each other.
  function merge(patch) {
    return ready().then(function (ms) {
      if (!ms) return null;
      return get().then(function (current) {
        var next = {};
        Object.keys(current).forEach(function (k) { next[k] = current[k]; });
        Object.keys(patch).forEach(function (k) { next[k] = patch[k]; });
        return ms.updateMemberJSON({ json: next })
          .then(function () { return next; })
          .catch(function () { return null; });
      });
    });
  }

  return { get: get, merge: merge };
})();
