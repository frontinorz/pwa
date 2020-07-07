// Define static file to catch
const filesToCache = ["/", "/index.html"];
const cacheName = "static-v1";

// install
self.addEventListener("install", (evt) => {
  // evt 會等到 waitUntil 中傳入的 promise 成功後再進入下一個階段
  evt.waitUntil(
    // 自訂一個 cache 命名為 static-v1，再把定義的陣列(filesToCache) 存入 cache object
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// activate
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    /*
      caches.keys()用於取出所有的cacheName，回傳內容為 string 的 Array 
      ex:['static-v1', 'static-v1-api']
    */

    caches.keys().then((cacheNames) => {
      let promiseArr = cacheNames.map((item) => {
        // 如果不等於 cacheName 就刪除此 cache
        if (item !== cacheName) {
          return caches.delete(item);
        }
      });
      // 等待所有 caches promise結束後回傳
      return Promise.all(promiseArr);
    })
  );
});

// fetch
// 必須將每一次的 Response 做 cache，才可以在離線的時候做存取
self.addEventListener("fetch", (evt) => {
  const dataUrl = "http://localhost:3000/people";
  // request 透過 respondWith 回傳 response 給網頁。
  evt.respondWith(
    // 檢查對應的 cache
    caches.match(evt.request).then(function (response) {
      return (
        // 有對應的就回傳
        response ||
        // 沒有的就發送 HTTP request
        fetch(evt.request).then((res) =>
          // 存 caches 之前，要先打開 caches.open(dataCacheName)
          caches.open(dataCacheName).then(function (cache) {
            // cache.put(key, value)
            // 下一次 caches.match 會對應到 evt.request
            cache.put(evt.request, res.clone());
            return res;
          })
        )
      );
    })
  );
});
