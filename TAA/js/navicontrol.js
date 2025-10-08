document.addEventListener('DOMContentLoaded', function () {
  //點擊顯示導覽列時，body scroll隱藏
  const navbarCollapse = document.getElementById('navbars');

  navbarCollapse.addEventListener('show.bs.collapse', () => {
    document.body.style.overflow = 'hidden'; // 禁止捲動
  });

  navbarCollapse.addEventListener('hidden.bs.collapse', () => {
    document.body.style.overflow = ''; // 恢復捲動
  });


  // 只在小螢幕啟用 (lg 以下)
  function enableSubmenuToggle() {
    const mediaQuery = window.matchMedia("(max-width: 991.98px)");
    const navItems = document.querySelectorAll("#navbars .navbar-nav .nav-item");

    navItems.forEach(item => {
      const link = item.querySelector(".nav-link");
      const subMenu = item.querySelector(".nav-main-sub");

      if (subMenu && link) {
        // 移除之前的事件避免重複
        link.removeEventListener("click", link._toggleHandler);

        if (mediaQuery.matches) {
          link._toggleHandler = function (e) {
            e.preventDefault(); // 阻止直接跳頁
			  
			// 先把其他打開的 submenu 收起來
            document.querySelectorAll(".nav-main-sub.show").forEach(openMenu => {
              if (openMenu !== subMenu) {
                openMenu.classList.remove("show");
              }
            }); 
			// 切換目前 submenu
            subMenu.classList.toggle("show");  
			  
          };
          link.addEventListener("click", link._toggleHandler);
        } else {
          // 大螢幕時，保證 submenu 關閉
          subMenu.classList.remove("show");
        }
      }
    });
  }

  enableSubmenuToggle();
  window.addEventListener("resize", enableSubmenuToggle);


});
