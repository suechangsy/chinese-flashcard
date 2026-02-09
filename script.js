let HSK = {};
let currentWord = "";

// 读取 HSK 词库
fetch("hsk.json")
  .then(res => res.json())
  .then(data => HSK = data);

// 自动生成拼音（无词典）
function getPinyin(word) {
  return pinyin(word, { toneType: "symbol" }).join(" ");
}

// 生成 Flashcard
function generateCard() {
  const word = document.getElementById("wordInput").value.trim();
  if (!word) return;

  currentWord = word;

  let data = HSK[word];

  // 老师补充优先
  const saved = localStorage.getItem("custom_" + word);
  if (saved) data = JSON.parse(saved);

  const pinyinText = getPinyin(word);
  const enText = data ? data.en : "⚠️ 请老师补充英文";

  document.getElementById("card-area").innerHTML = `
    <div class="flashcard" id="flashcard">
      <h2>${word}</h2>
      <p class="pinyin" id="pinyin" style="display:none">${pinyinText}</p>
      <p>${enText}</p>
      <button onclick="togglePinyin()">拼音</button>
      <button onclick="speak()">🔊</button>
    </div>
  `;

  document.getElementById("teacher-box").style.display =
    data ? "none" : "block";
}

// 显示 / 隐藏拼音
function togglePinyin() {
  const p = document.getElementById("pinyin");
  p.style.display = p.style.display === "none" ? "block" : "none";
}

// 中文朗读
function speak() {
  const u = new SpeechSynthesisUtterance(currentWord);
  u.lang = "zh-CN";
  speechSynthesis.speak(u);
}

// 老师补充并保存
function saveTeacherTranslation() {
  const en = document.getElementById("teacher-en").value.trim();
  if (!en) return;

  const data = {
    en: en,
    pinyin: getPinyin(currentWord)
  };

  localStorage.setItem(
    "custom_" + currentWord,
    JSON.stringify(data)
  );

  alert("已保存，下次自动使用");
  generateCard();
}

// 导出 A4 PDF
function exportPDF() {
  const element = document.getElementById("flashcard");
  if (!element) return;

  html2pdf().from(element).set({
    margin: 10,
    filename: "chinese_flashcards.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { format: "a4", orientation: "portrait" }
  }).save();
}
