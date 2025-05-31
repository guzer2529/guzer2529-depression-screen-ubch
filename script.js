const twoQ = [
  "ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกหดหู่เศร้าหรือท้อแท้สิ้นหวังหรือไม่?",
  "ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลินหรือไม่?"
];

const nineQ = [
  "เบื่อ ไม่สนใจทำอะไร",
  "ไม่สบายใจ ซึมเศร้า ท้อแท้",
  "หลับยากหรือหลับๆตื่นๆ หรือหลับมากไป",
  "เหนื่อยง่ายหรือไม่ค่อยมีแรง",
  "เบื่ออาหาร หรือกินมากเกินไป",
  "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง",
  "สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ",
  "พูดช้า ทำอะไรช้าลง จนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น",
  "คิดทำร้ายตนเองหรือคิดว่าถ้าตายไปคงจะดี"
];
const nineChoices = [
  { label: "ไม่มีเลย", value: 0 },
  { label: "เป็นบางวัน (1-7 วัน)", value: 1 },
  { label: "เป็นบ่อย (>7 วัน)", value: 2 },
  { label: "เป็นทุกวัน", value: 3 }
];

const eightQ = [
  { q: "ช่วง 1 เดือนที่ผ่านมา คิดอยากตาย หรือคิดว่าตายไปจะดีกว่า", score: [0, 1] },
  { q: "ช่วง 1 เดือนที่ผ่านมา อยากทำร้ายตัวเอง หรือทำให้ตัวเองบาดเจ็บ", score: [0, 2] },
  { q: "ช่วง 1 เดือนที่ผ่านมา คิดเกี่ยวกับการฆ่าตัวตาย", score: [0, 6] },
  { q: "ถ้าตอบว่าคิดเกี่ยวกับการฆ่าตัวตาย ท่านสามารถควบคุมความอยากฆ่าตัวตายที่ท่านคิดอยู่นั้นได้หรือไม่? (ตอบ 'ไม่ได้' ให้ 8 คะแนน)", score: [0, 8], conditional: 2 },
  { q: "ช่วง 1 เดือนที่ผ่านมา มีแผนการที่จะฆ่าตัวตาย", score: [0, 8] },
  { q: "ช่วง 1 เดือนที่ผ่านมา ได้เตรียมการที่จะทำร้ายตนเอง หรือเตรียมการจะฆ่าตัวตาย โดยตั้งใจว่าจะให้ตายจริงๆ", score: [0, 9] },
  { q: "ช่วง 1 เดือนที่ผ่านมา ได้ทำให้ตนเองบาดเจ็บ แต่ไม่ตั้งใจที่จะทำให้เสียชีวิต", score: [0, 4] },
  { q: "ช่วง 1 เดือนที่ผ่านมา ได้พยายามฆ่าตัวตาย โดยคาดหวัง/ตั้งใจที่จะให้ตาย", score: [0, 10] },
  { q: "ตลอดชีวิตที่ผ่านมา ท่านเคยพยายามฆ่าตัวตาย", score: [0, 4] }
];

let step = 1; // 1=2Q, 2=9Q, 3=8Q, 4=result
let twoQAnswers = [];
let nineQAnswers = [];
let eightQAnswers = [];

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (step === 1) {
    twoQ.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `
        <p>${q}</p>
        <button onclick="answer2Q(${i}, true)" class="${twoQAnswers[i] === true ? 'selected' : ''}">มี</button>
        <button onclick="answer2Q(${i}, false)" class="${twoQAnswers[i] === false ? 'selected' : ''}">ไม่มี</button>
      `;
      app.appendChild(div);
    });
  } else if (step === 2) {
    nineQ.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `<p>${i+1}. ${q}</p>` +
        nineChoices.map(
          (ch) =>
            `<button onclick="answer9Q(${i}, ${ch.value})" class="${nineQAnswers[i] === ch.value ? 'selected' : ''}">${ch.label}</button>`
        ).join('');
      app.appendChild(div);
    });
  } else if (step === 3) {
    eightQ.forEach((item, i) => {
      if (item.conditional !== undefined) {
        // ข้อ 4 ให้ถามต่อเมื่อข้อ 3 ตอบ 'มี'
        if (eightQAnswers[item.conditional] !== 1) return;
      }
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `
        <p>${i+1}. ${item.q}</p>
        <button onclick="answer8Q(${i}, 0)" class="${eightQAnswers[i] === 0 ? 'selected' : ''}">ไม่มี/ได้</button>
        <button onclick="answer8Q(${i}, 1)" class="${eightQAnswers[i] === 1 ? 'selected' : ''}">มี/ไม่ได้</button>
      `;
      app.appendChild(div);
    });
  } else if (step === 4) {
    // Summary result section
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result';
    // 2Q
    const is2QPositive = twoQAnswers.includes(true);
    resultDiv.innerHTML = `<h2>ผลการประเมิน</h2><hr style='margin:16px;'>`;
    resultDiv.innerHTML += `<b>2Q:</b> ${is2QPositive ? 'มีแนวโน้มซึมเศร้า' : 'ปกติ ไม่เป็นโรคซึมเศร้า'}<br/>`;

    if (is2QPositive) {
      // 9Q
      const score9Q = nineQAnswers.reduce((sum, v) => sum + (v ?? 0), 0);
      let level9Q = '';
      let color9Q = '';
      if (score9Q <= 6) {
        level9Q = 'ไม่มีภาวะซึมเศร้า';
        color9Q = 'green';
      } else if (score9Q <= 12) {
        level9Q = 'ภาวะซึมเศร้าระดับน้อย';
        color9Q = 'green';
      } else if (score9Q <= 18) {
        level9Q = 'ภาวะซึมเศร้าระดับปานกลาง';
        color9Q = 'orange';
      } else {
        level9Q = 'ภาวะซึมเศร้าระดับรุนแรง';
        color9Q = 'red';
      }
      // ใช้ inline style เพื่อความง่าย
      resultDiv.innerHTML += `<b>9Q:</b> ${score9Q} คะแนน (<span style="background:${
        color9Q === 'green'
          ? '#d1fae5'
          : color9Q === 'orange'
          ? '#fef9c3'
          : '#fee2e2'
      };color:${
        color9Q === 'green'
          ? '#059669'
          : color9Q === 'orange'
          ? '#ea580c'
          : '#dc2626'
      };font-weight:700;padding:2px 8px;border-radius:8px">${level9Q}</span>)<br/>`;

      // 8Q เฉพาะถ้า 9Q >= 7
      if (score9Q >= 7) {
        let eightQScore = 0;
        for (let i = 0; i < eightQ.length; i++) {
          if (eightQ[i].conditional !== undefined && eightQAnswers[eightQ[i].conditional] !== 1) continue;
          if (eightQAnswers[i] != null) eightQScore += eightQ[i].score[eightQAnswers[i]];
        }
        let level8Q = eightQScore === 0 ? 'ไม่มีแนวโน้มจะฆ่าตัวตายในปัจจุบัน'
          : eightQScore <= 8 ? 'แนวโน้มจะฆ่าตัวตายในปัจจุบันในระดับน้อย'
          : eightQScore <= 16 ? 'แนวโน้มจะฆ่าตัวตายในปัจจุบันในระดับปานกลาง'
          : 'แนวโน้มจะฆ่าตัวตายในปัจจุบันในระดับรุนแรง';
        // ตรงนี้ ถ้าต้องการสีแยกแบบ 9Q ทำแบบเดียวกันได้
        resultDiv.innerHTML += `<b>8Q:</b> ${eightQScore} คะแนน (${level8Q})<br/>`;
      }
    }
    app.appendChild(resultDiv);
  }
}

function answer2Q(index, value) {
  twoQAnswers[index] = value;
  render();
  if (twoQAnswers.length === 2 && twoQAnswers.every(v => v !== undefined)) {
    if (twoQAnswers.includes(true)) {
      step = 2;
    } else {
      step = 4;
    }
    setTimeout(render, 250);
  }
}

function answer9Q(index, value) {
  nineQAnswers[index] = value;
  render();
  if (nineQAnswers.length === 9 && nineQAnswers.every(v => v !== undefined)) {
    const score9Q = nineQAnswers.reduce((sum, v) => sum + (v ?? 0), 0);
    if (score9Q >= 7) {
      step = 3;
    } else {
      step = 4;
    }
    setTimeout(render, 250);
  }
}

function answer8Q(index, value) {
  eightQAnswers[index] = value;
  render();
  let totalQs = eightQ.length;
  if (eightQAnswers[2] !== 1) totalQs -= 1;
  if (eightQAnswers.filter(v => v !== undefined).length === totalQs) {
    step = 4;
    setTimeout(render, 180);
  }
}

function restart() {
  step = 1;
  twoQAnswers = [];
  nineQAnswers = [];
  eightQAnswers = [];
  render();
}

document.addEventListener('DOMContentLoaded', render);
