function modalAlert(size, title, html){
    $('body').append(`<div class="modal fade modalAlert" id="modalAlert" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="modalAlertLabel">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h4 class="modal-title h3" id="modalAlertLabel">`+ title +`</h4>
                            </div>
                            <div class="modal-body">`+
                              html +
                            `</div>
                          </div>
                        </div>
                      </div>`);
    
    switch (size){
        case 'sm':
            $('#modalAlert .modal-dialog').addClass('modal-sm');
            break;
        case 'md':
            $('#modalAlert .modal-dialog').addClass('modal-md');
            break;
        case 'lg':
            $('#modalAlert .modal-dialog').addClass('modal-lg');
            break;
        default: 
            //md
            break;
    }
    
    $('#modalAlert').modal('show');
}