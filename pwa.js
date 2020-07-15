let deferredPrompt = null;
let pwaInstallStatus = true; // 預設 pwa 狀態為已安裝

window.addEventListener("load", (event) => {
  // 已安裝 或 iOS 或 不是手機 就不顯示 pwa 按鈕區塊 & 不執行 initPWA()
  // 瀏覽器不是 chrome 的不顯示，但實際 userAgent 無法真正去偵測是哪個瀏覽器
  if (isStandaloneMode() || isIos() || !isMobile() || !isChrome()) {
    $("#pwa-block").hide();
    return;
  }

  // 過一秒後，執行 initPWA()
  setTimeout(() => {
    initPWA();
  }, 1000);
});

// 註冊 sw.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt event");

  if (pwaInstallStatus) {
    pwaInstallStatus = false; // 能進來此事件代表: 未安裝 pwa
    initPWA();
  }

  e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  deferredPrompt = e; // Stash the event so it can be triggered later.

  // pwa下載視窗的選擇處理
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      // 同意下載，過五秒才更新，因無法偵測是否安裝完成
      setPWABlock("installing");
      setTimeout(() => {
        pwaInstallStatus = true;
        initPWA();
      }, 5000);
    }
  });
});

// 決定顯示登入頁面的 下載 與 打開 app 的按鈕
function initPWA() {
  if (pwaInstallStatus == true) {
    // 已下載(顯示 open)
    setPWABlock("open");
  } else if (pwaInstallStatus == false) {
    // 未下載(顯示 download)
    setPWABlock("download");
  }
}

// 登入頁面的 pwa 按鈕區塊
function setPWABlock(type) {
  const openClass = "lnk-open";
  const downloadClass = "lnk-download";

  if (type == "open") {
    $("#pwa-block").data("type", "open");
    $("#pwa-block").text("Open");
    $("#pwa-block").attr("class", openClass);
  } else if (type == "download") {
    $("#pwa-block").data("type", "download");
    $("#pwa-block").text("Download App");
    $("#pwa-block").attr("class", downloadClass);
  } else if (type == "installing") {
    $("#pwa-block").data("type", "installing");
    $("#pwa-block").text("Installing");
    $("#pwa-block").attr("class", downloadClass);
  } else {
    $("#pwa-block").data("type", "");
    $("#pwa-block").text("");
    $("#pwa-block").attr("class", "");
  }
}

// 點擊 pwa 按鈕的處理
function clickPWABlockHandler() {
  const type = $("#pwa-block").data("type");
  if (type == "open") {
    window.open("./");
  } else if (type == "download") {
    deferredPrompt.prompt();
  }
}

// 切換右邊隱藏安裝按鈕
function toggleSideBlock() {
  $(".pwa-side-block").toggleClass("pwa-show-button");
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// 判斷是否在 PWA 上執行的
function isStandaloneMode() {
  return (
    navigator.standalone ||
    matchMedia("(display-mode: standalone)").matches ||
    matchMedia("(display-mode: fullscreen)").matches ||
    matchMedia("(display-mode: minimal-ui)").matches
  );
}

function isChrome() {
  return /chrome/i.test(window.navigator.userAgent);
}
