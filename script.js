const twoQ = [
  "ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกหดหู่เศร้าหรือท้อแท้สิ้นหวังหรือไม่?",
  "ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลินหรือไม่?"
];

const nineQ = [
  "เบื่อ ไม่สนใจทำอะไร",
  "ไม่สบายใจ ซึมเศร้า ท้อแท้",
  "หลับยาก หลับไม่สนิท หรือหลับมากไป",
  "เหนื่อยง่าย หรือไม่ค่อยมีแรง",
  "เบื่ออาหาร หรือกินมากเกินไป",
  "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว",
  "สมาธิไม่ดีเวลาทำอะไร",
  "พูดช้าลง หรือกระสับกระส่าย",
  "คิดทำร้ายตนเอง หรือคิดว่าตายไปคงจะดี"
];

let step = 1;
let twoQAnswers = [];
let nineQAnswers = [];

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (step === 1) {
    twoQ.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `<p>${q}</p>
        <button onclick="answer2Q(${i}, true)">มี</button>
        <button onclick="answer2Q(${i}, false)">ไม่มี</button>`;
      app.appendChild(div);
    });
  } else if (step === 2) {
    nineQ.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `<p>${i + 1}. ${q}</p>
        <button onclick="answer9Q(${i}, 0)">ไม่มีเลย</button>
        <button onclick="answer9Q(${i}, 1)">บางวัน</button>
        <button onclick="answer9Q(${i}, 2)">บ่อย</button>
        <button onclick="answer9Q(${i}, 3)">ทุกวัน</button>`;
      app.appendChild(div);
    });
  } else if (step === 3) {
    const score = nineQAnswers.reduce((sum, val) => sum + val, 0);
    const result = document.createElement('div');
    result.className = 'result';
    result.innerHTML = `<p>คะแนนรวม 9Q: ${score}</p>
      <p>${score <= 6 ? 'ไม่มีภาวะซึมเศร้า' :
        score <= 12 ? 'ภาวะซึมเศร้าระดับน้อย' :
        score <= 18 ? 'ระดับปานกลาง' : 'ระดับรุนแรง'}</p>`;
    app.appendChild(result);
  }
}

function answer2Q(index, value) {
  twoQAnswers[index] = value;
  if (twoQAnswers.length === 2 && twoQAnswers.includes(true)) {
    step = 2;
    render();
  } else if (twoQAnswers.length === 2 && !twoQAnswers.includes(true)) {
    step = 3;
    nineQAnswers = Array(9).fill(0);
    render();
  }
}

function answer9Q(index, value) {
  nineQAnswers[index] = value;
  if (nineQAnswers.every(v => v !== undefined)) {
    step = 3;
    render();
  }
}

function restart() {
  step = 1;
  twoQAnswers = [];
  nineQAnswers = [];
  render();
}

document.addEventListener('DOMContentLoaded', render);
