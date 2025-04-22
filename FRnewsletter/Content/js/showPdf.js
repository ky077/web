function showPdf(url) {
  var { pdfjsLib } = globalThis;

  pdfjsLib.GlobalWorkerOptions.workerSrc = '../Content/widgets/pdfjs-4.2.67-dist/build/pdf.worker.mjs';

  var pdfDoc = null,
      container = document.getElementById('pdf-container');

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({ scale: 1 });
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var containerWidth = container.clientWidth;
      var scaleX = containerWidth / viewport.width;
      var scaledViewport = page.getViewport({ scale: scaleX });

      canvas.style.width = '100%';
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      canvas.id = `p${num}`;
      container.appendChild(canvas);

      var renderContext = {
        canvasContext: ctx,
        viewport: scaledViewport
      };
      var renderTask = page.render(renderContext);

      renderTask.promise.then(function () {
        checkHashAndScroll(num);  // 在每次渲染完一頁後立即檢查並滾動

        if (num < pdfDoc.numPages) {
          renderPage(num + 1);
        }
      });
    });
  }

  /**
   * Asynchronously downloads PDF.
   */
  pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;

    // Render all pages
    renderPage(1);
  });

  /**
   * Check URL hash and scroll to the corresponding page.
   */
  function checkHashAndScroll(num) {
    var hash = window.location.hash;
    if (hash && hash.startsWith('#p')) {
      var pageNum = parseInt(hash.substring(2), 10);
      if (num === pageNum) {
        var target = document.getElementById(`p${pageNum}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }
}
