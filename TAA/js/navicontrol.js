document.addEventListener('DOMContentLoaded', function () {
  const navbarCollapse = document.getElementById('navbars');
  const header = document.querySelector('.header');
  const mediaQuery = window.matchMedia("(max-width: 991.98px)");
	
  // 更新navbar位置 (小螢幕lg 以下啟用)
  function updateNavbarPosition() {
    if (mediaQuery.matches && header) {
      const headerHeight = Math.ceil(header.getBoundingClientRect().height);  console.log(headerHeight);
      navbarCollapse.style.top = `${headerHeight}px`;
    } else {
      navbarCollapse.style.top = '';
    }
  }

  updateNavbarPosition();
  window.addEventListener('resize', updateNavbarPosition);	
	
	
  // body scroll 控制
  navbarCollapse.addEventListener('show.bs.collapse', () => {
    document.body.style.overflow = 'hidden'; // 禁止捲動
  });

  navbarCollapse.addEventListener('hidden.bs.collapse', () => {
    document.body.style.overflow = ''; // 恢復捲動
  });


  // nav-main-sub收合 (小螢幕lg 以下啟用)
  function enableSubmenuToggle() {
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
