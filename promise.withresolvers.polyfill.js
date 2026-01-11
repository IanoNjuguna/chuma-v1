// Polyfill for Promise.withResolvers for compatibility with browsers/environments that do not support it natively.
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function withResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Polyfill/fallback for PDF.js workerSrc if not set by the app
try {
  // Only set if running in browser and pdfjs-dist is loaded
  if (typeof window !== 'undefined') {
    // Dynamically import pdfjs-dist if available
    import('pdfjs-dist/build/pdf.worker.mjs').then(() => {
      const { GlobalWorkerOptions } = require('pdfjs-dist');
      if (!GlobalWorkerOptions.workerSrc) {
        GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
      }
    }).catch(() => {
      // Ignore if pdfjs-dist is not loaded yet
    });
  }
} catch (e) {
  // Ignore errors
}
