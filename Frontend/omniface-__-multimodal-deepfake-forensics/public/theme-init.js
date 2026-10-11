(function () {
  try {
    var t = localStorage.getItem('omniface_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
