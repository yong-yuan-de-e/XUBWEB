/**
 * 新闻模块的修改，把原本的固定模块修改为了js动态加载的方式
 */
document.addEventListener("DOMContentLoaded", function () {
  const newsList = [
    {
      img: "./img/news_1.png",
      title: "宣传部党支部召开“习近平文化思想”专题理论学习会",
      link: "./inner.html",
      date: "2024年10月29日 15:01",
    },
    {
      img: "./img/news_2.png",
      title:
        "凝心聚力强文化 提质进位创辉煌 ——党委宣传部、总务处、教育发展基金会办公室、哲学与公共管理学院、经济学院 联合举办主题党日活动-宣传部思想论坛 ",
      link: "./inner.html",
      date: "2024年10月27日 16:02",
    },
    {
      img: "./img/news_3.png",
      title: "河南省报业协会秘书长李宜鹏一行到我校调研座谈-宣传部思想论坛",
      link: "./inner.html",
      date: "2024年10月25日 09:47",
    },
    // 可继续添加更多新闻
  ];

  const newsListEl = document.getElementById("newsList");
  const covers = document.getElementById("carouselWrapper");
  const coverBtn = document.getElementById("carouselButtons");

  let loadedCount = 0;
  const batchSize = 5; // 每次加载5条
  let currentCoverIndex = 0;

  // 创建 sentinel 元素
  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  newsListEl.appendChild(sentinel);

  // 懒加载新闻
  function addNewsItem() {
    const nextBatch = newsList.slice(loadedCount, loadedCount + batchSize);
    nextBatch.forEach((element, idx) => {
      // 新闻项
      const item = document.createElement("div");
      item.className = "newsItem";
      item.innerHTML = `
        <div class="newsContent">
          <h3 class="singleRow">${element.title || ""}</h3>
          <p class="singleRow">${element.date || ""}</p>
        </div>
        <div class="singleRow">${element.abstract || ""}</div>
      `;
      item.onclick = () => {
        currentCoverIndex = loadedCount + idx;
        showNewsItem(currentCoverIndex);
      };
      newsListEl.insertBefore(item, sentinel);
    });
    loadedCount += nextBatch.length;
    // 按钮栏同步添加
    renderCoverButtons();
    // 如果全部加载完，移除观察
    if (loadedCount >= newsList.length) {
      observer.unobserve(sentinel);
      sentinel.remove();
    }
  }

  // IntersectionObserver 回调
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          addNewsItem();
        }
      });
    },
    {
      root: newsListEl,
      rootMargin: "0px",
      threshold: 1.0,
    }
  );

  // 渲染轮播封面
  function showNewsItem(idx) {
  // 高亮新闻
  const newsItems = newsListEl.querySelectorAll(".newsItem");
  newsItems.forEach((item, i) => {
    item.classList.toggle("active", i === idx);
  });

  // 图片切换动画
  const oldImg = covers.querySelector('.coverImage');
  if (oldImg) {
    oldImg.classList.add('fade-out');
    oldImg.addEventListener('animationend', () => {
      oldImg.remove();
      insertNewImg();
    }, { once: true });
  } else {
    insertNewImg();
  }

  function insertNewImg() {
    const img = document.createElement('img');
    img.src = newsList[idx].img;
    img.alt = "封面图片";
    img.className = "coverImage fade-in";
    covers.appendChild(img);
    img.addEventListener('animationend', () => {
      img.classList.remove('fade-in');
    }, { once: true });
  }

  // 按钮高亮
  const btns = coverBtn.querySelectorAll("button");
  btns.forEach((btn, i) => {
    btn.classList.toggle("active", i === idx);
  });
}

  // 渲染轮播按钮
  function renderCoverButtons() {
    coverBtn.innerHTML = "";
    for (let i = 0; i < loadedCount; i++) {
      const btn = document.createElement("button");
      btn.className = "coverBtn";
      if (i === currentCoverIndex) btn.classList.add("active");
      btn.onclick = () => {
        currentCoverIndex = i;
        showNewsItem(currentCoverIndex);
      };
      coverBtn.appendChild(btn);
    }
  }

  // 初始加载
  addNewsItem();
  showNewsItem(currentCoverIndex);
  observer.observe(sentinel);
});
