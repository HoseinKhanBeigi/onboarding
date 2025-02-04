// eslint-disable-next-line import/extensions
import Worker from './worker.js';
// eslint-disable-next-line import/extensions
import './plugin/jspdf-plugin.js';
// eslint-disable-next-line import/extensions
import './plugin/pagebreaks.js';
// eslint-disable-next-line import/extensions
import './plugin/hyperlinks.js';

const html2pdf = function html2pdf(src, opt) {
  // Create a new worker with the given options.
  const worker = new html2pdf.Worker(opt);

  if (src) {
    // If src is specified, perform the traditional 'simple' operation.
    return worker.from(src).save();
  } else {
    // Otherwise, return the worker for new Promise-based operation.
    return worker;
  }
};
html2pdf.Worker = Worker;

// Expose the html2pdf function.
export default html2pdf;
