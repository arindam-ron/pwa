if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa/sw.js', {
    scope: '/pwa/'
  }).catch(err => console.log(err));
}
