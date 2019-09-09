if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa/sw.js').catch(err => console.log(err));
}
