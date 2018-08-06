/*
  This is just for generating the CodeSandbox preview, based on
  https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
*/
function readTextFile(file) {
  const rawFile = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          resolve(rawFile.responseText);
        } else {
          reject(console.error('Something went wrong.'));
        }
      }
    };
    rawFile.send(null);
  });
}

function previewCode(sel, src) {
  readTextFile('src/logFactory.js').then(text => {
    document.getElementById(
      'app',
    ).innerHTML = `<pre><code>${text}</code></pre>`;
  });
}

previewCode('app', 'src/logFactory');
