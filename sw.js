// Define static file to catch
const filesToCache = [
  "/",
  "/assets/images/btn_check.png",
  "/assets/images/btn_del.png",
  "/assets/images/ic_add.png",
  "/assets/images/logo_todo.png",
  "/style/style.css",
  "/index.html",
];

const cacheName = "todolist-v1";

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
