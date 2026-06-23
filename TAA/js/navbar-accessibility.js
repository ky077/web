document.addEventListener('DOMContentLoaded', function () {
  var toggler = document.querySelector('.navbar-toggler');
  var navbars = document.getElementById('navbars');

  if (!toggler || !navbars || typeof bootstrap === 'undefined') {
    return;
  }

  var collapse = bootstrap.Collapse.getOrCreateInstance(navbars, {
    toggle: false
  });

  function isMobileMenu() {
    return window.matchMedia('(max-width: 991.98px)').matches;
  }

  function isMenuOpen() {
    return navbars.classList.contains('show');
  }

  function closeMenu() {
    if (isMobileMenu() && isMenuOpen()) {
      collapse.hide();
    }
  }

  /* 按 Esc 關閉選單，並把焦點放回漢堡按鈕 */
  navbars.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      event.preventDefault();
      collapse.hide();
      toggler.focus();
    }
  });

  /* 焦點離開選單範圍時，自動收合 */
  document.addEventListener('focusin', function (event) {
    if (!isMobileMenu() || !isMenuOpen()) {
      return;
    }

    var target = event.target;
    var focusInsideMenu = navbars.contains(target);
    var focusOnToggler = toggler.contains(target) || toggler === target;

    if (!focusInsideMenu && !focusOnToggler) {
      collapse.hide();
    }
  });

  /* 點選選單內連結後也收合，避免遮蔽下一頁或錨點內容 */
  navbars.addEventListener('click', function (event) {
    var link = event.target.closest('a');

    if (link && isMobileMenu() && isMenuOpen()) {
      collapse.hide();
    }
  });

  /* 視窗從手機版變回桌機版時，清掉手機版展開狀態 */
  window.addEventListener('resize', function () {
    if (!isMobileMenu() && isMenuOpen()) {
      collapse.hide();
    }
  });
});