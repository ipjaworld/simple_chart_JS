// 캔버스 요소 가져오기
const canvas = document.getElementById('candlestick-chart');
canvas.width = 800;
canvas.height = 400;
const ctx = canvas.getContext('2d');

// 데이터 설정
const data = [
  { open: 10, high: 11, low: 9, close: 15 },
  { open: 50, high: 35, low: 25, close: 32 },
  { open: 32, high: 38, low: 28, close: 34 },
  { open: 34, high: 38, low: 28, close: 36 },
  { open: 36, high: 38, low: 28, close: 38 },
  { open: 38, high: 38, low: 28, close: 40 },
  { open: 40, high: 38, low: 28, close: 42 },
  { open: 42, high: 38, low: 28, close: 44 },
  { open: 44, high: 38, low: 28, close: 46 },
  { open: 46, high: 38, low: 28, close: 48 },
  { open: 48, high: 38, low: 28, close: 50 },
  { open: 50, high: 38, low: 28, close: 52 },
  { open: 52, high: 38, low: 28, close: 54 },
  { open: 54, high: 38, low: 28, close: 56 },
  { open: 56, high: 38, low: 28, close: 58 },
  { open: 58, high: 38, low: 28, close: 80 },
];

// 차트 그리기
function drawCandlestickChart(data) {
  const candleWidth = 10;
  const gap = 5;
  const paddingLeft = 50;
  const paddingBottom = 50;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 축 그리기
  ctx.beginPath();
  ctx.moveTo(paddingLeft, 0);
  ctx.lineTo(paddingLeft, canvas.height - paddingBottom);
  ctx.lineTo(canvas.width, canvas.height - paddingBottom);
  ctx.stroke();

  // 눈금 그리기
  const yAxisInterval = 10;
  const yAxisMaxValue = 100;
  for (let i = 0; i <= yAxisMaxValue; i += yAxisInterval) {
    ctx.fillText(i, paddingLeft - 20, canvas.height - paddingBottom - i);
    ctx.beginPath();
    ctx.moveTo(paddingLeft - 5, canvas.height - paddingBottom - i);
    ctx.lineTo(paddingLeft, canvas.height - paddingBottom - i);
    ctx.stroke();
  }

  data.forEach((item, index) => {
    const x = paddingLeft + index * (candleWidth + gap);

    // 라인 그리기
    ctx.beginPath();
    ctx.moveTo(x + candleWidth / 2, canvas.height - paddingBottom - item.high);
    ctx.lineTo(x + candleWidth / 2, canvas.height - paddingBottom - item.low);
    ctx.stroke();

    // 블록 그리기
    const color = item.open > item.close ? 'red' : 'green';
    ctx.fillStyle = color;
    ctx.fillRect(x, canvas.height - paddingBottom - item.open, candleWidth, item.close - item.open);
  });
}

drawCandlestickChart(data);