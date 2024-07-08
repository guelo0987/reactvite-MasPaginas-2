import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Asegúrate de establecer el worker de pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PensumCarreraViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Página {pageNumber} de {numPages}
      </p>
      <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
        Anterior
      </button>
      <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
        Siguiente
      </button>
    </div>
  );
}
