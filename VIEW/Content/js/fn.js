//nav當前頁active  (僅 探索、讚生涯測驗、我的收藏 有用)
function navActive(page){ 
	$('.nav-' + page).addClass('active'); 
}

//選單 nav-user < 1200 為展開狀態
function toggleDropdownByScreenWidth() {
	const $dropdown = $('.nav-user').parents('.dropdown');
	const $menu = $dropdown.find('.dropdown-menu');
	const $button = $dropdown.find('.dropdown-toggle');

	if ($(window).width() < 1200) {
		$dropdown.addClass('show');
		$menu.addClass('show');
		$button.attr('aria-expanded', 'true');
	} else {
		$dropdown.removeClass('show');
		$menu.removeClass('show');
		$button.attr('aria-expanded', 'false');
	}
}

function goCopy(){
    var _copy = $('#copyLink');
    _copy.select();
    document.execCommand('Copy');
    //$('body').append('<div class="copyMsg"><span>連結已複製</span></div>');
    
    //var interval = setInterval(function() {
//        $('.copyMsg').remove();
//    }, 3000);
}  

//alertModal 警報視窗 (無右上X，不可點黑處關閉)  [sm|md|lg|xl]
function alertModalDOM(html, size='md', btnOkText='Ok'){
    $('body').append(`<div class="modal fade" id="alertModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div class="modal-dialog modal-dialog-centered modal-` + size + `">
                    <div class="modal-content">
                      <div class="modal-body pt-5 d-flex flex-column align-items-center text-lg-center">
                         <div>`
                           + html +
                        `</div>
                         <div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal" id="ALERT_OK">` + btnOkText + `</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
    
    $('#alertModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

//confirmModal 確認視窗 (無右上X，不可點黑處關閉)  [sm|md|lg|xl]
function confirmModalDOM(html, size='md', btnCancelText='Cancel', btnSubmitText='Submit'){
    $('body').append(`<div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div class="modal-dialog modal-dialog-centered modal-` + size + `">
                    <div class="modal-content">
                      <div class="modal-body pt-5 d-flex flex-column align-items-center text-lg-center">
                        <div>`
                          + html +
                        `</div>
                          <div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-outline-primary rounded-pill px-4" data-bs-dismiss="modal">` + btnCancelText + `</button>
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal" id="CONFIRM_OK">` + btnSubmitText + `</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
    var confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    confirmModal.show();
    
    $('#confirmModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

//msgModalDOM 訊息視窗 (有右上X，可點黑處關閉)  [sm|md|lg|xl]
function msgModalDOM(html, size='md', btnCloseText='Close'){
    $('body').append(`<div class="modal fade" id="msgModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-` + size + `">
                    <div class="modal-content">
                      <div class="modal-body">
                        <div class="text-end mb-3">
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div>`
                          + html +
                        `</div>
                         <div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal">` + btnCloseText + `</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
    var msgModal = new bootstrap.Modal(document.getElementById('msgModal'));
    msgModal.show();
    
    $('#msgModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

//toastDOM 吐司推播通知
function toastDOM(html){
    $('body').append(`<div class="toast-container">
                        <div id="toast" class="toast text-bg-dark bg-opacity-75 position-fixed top-50 start-50 translate-middle" role="alert" aria-live="polite" aria-atomic="true" data-bs-delay="1000">
                          <div class="d-flex">
                            <div class="toast-body">
                            ` + html + `
                            </div>
                            <button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                          </div>
                        </div>
                      </div>`);

    const toastEl = document.getElementById('toast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEl);
    toastBootstrap.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.closest('.toast-container').remove();
    })
}