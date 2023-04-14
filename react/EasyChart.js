// easy_chart.js
import React, { useRef, useEffect } from 'react';

const EasyChart = ({ data }) => {
  const canvasRef = useRef();

  /**
   * drawCandlestickChart
   * @param {object} inputData 들어오는 데이터,
   * @param {object} ctx 
   */
  const drawCandlestickChart = ( inputData, ctx ) => {

    // 들어온 데이터와 차트용 데이터를 나누기.
    const data = inputData.map((item) => {
      return {
        // 가장 기본적인 open, high, low, close 입니다.
        open : item.open,
        high : item.high,
        low : item.low,
        close : item.trade,
        /**
         * date_time_utc : ,
         * date_time_kst : ,
         * 등등 필요한 데이터를 더 추가합니다.
        */
      }
    });

    // 최소값과 최대값 찾기
    const minPrice = Math.min(...data.map(item => item.low));
    const maxPrice = Math.max(...data.map(item => item.high));

    const candleWidth = 10;
    const gap = 5;
    const paddingLeft = 100;
    const paddingBottom = 50;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // 축 그리기
    ctx.beginPath();
    ctx.moveTo(paddingLeft, 0);
    ctx.lineTo(paddingLeft, canvasRef.current.height - paddingBottom);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height - paddingBottom);
    ctx.stroke();

    // 눈금 그리기
    // 인터벌 정하는 로직
    /**
     * 10, 20, 100, 200, 1000, 2000 등으로 나눠서 그 몫이 10 이하가 될때까지 반복한다.
     * 그렇게 해서 가장 자연스러울 수 있는 숫자로 하면 되는데 일단 maxPrice와 minPrice가 있으니 할 수 있다
     */
    const tempInterval = maxPrice - minPrice;
    // 인터벌을 반복해서 연산시킨다. interval만 계산해서 시간을 최소화한다.
    const findInterval = (interval) => {
      if( interval < 100 ){
        return 10;
      }

      const baseDividers = [10, 20];
      const dividers = [];

      for (let i = 0; i <= 10; i++) {
        const multiplier = Math.pow(10, i);
        baseDividers.forEach((divider) => {
          dividers.push(divider * multiplier);
        });
      }

      for (let i = 0; i < dividers.length; i++) {
        const quotient = interval / dividers[i];
        if (quotient < 10) {
          return interval / quotient;
        }
      }
      return interval;
    };

    // 눈금 정할 때 필요한 단위들 변수화
    const yAxisInterval = findInterval(tempInterval);
    const yAxisMaxValue = maxPrice;
    const yAxisMinValue = minPrice;
    // 눈금 그리기
    for (let i = yAxisMinValue; i <= yAxisMaxValue; i += yAxisInterval) {
      const yPos = canvasRef.current.height - paddingBottom - ((i - yAxisMinValue) * (canvasRef.current.height - paddingBottom) / (yAxisMaxValue - yAxisMinValue));
      // 여기 있는 조건문은 다루는 데이터의 범위에 따라 알맞게 조절하면 됩니다. 이는 예시일 뿐입니다.
      const semiDivider = maxPrice < 10000 ? 10 : maxPrice > 1000000 ? 1000 : 100;
      ctx.fillText(( Math.ceil(i/semiDivider) * semiDivider ), paddingLeft - 20, yPos);
      ctx.beginPath();
      ctx.moveTo(paddingLeft - 5, yPos);
      ctx.lineTo(paddingLeft, yPos);
      ctx.stroke();
    }

    data.forEach((item, index) => {
      const x = paddingLeft + index * (candleWidth + gap);

      // 라인 그리기
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, canvasRef.current.height - paddingBottom - (item.high - yAxisMinValue) * (canvasRef.current.height - paddingBottom) / (yAxisMaxValue - yAxisMinValue));
      ctx.lineTo(x + candleWidth / 2, canvasRef.current.height - paddingBottom - (item.low - yAxisMinValue) * (canvasRef.current.height - paddingBottom) / (yAxisMaxValue - yAxisMinValue));
      ctx.stroke();

      // 블록 그리기
      const color = item.open > item.close ? 'blue' : 'red';
      ctx.fillStyle = color;
      ctx.fillRect(
        x,
        canvasRef.current.height - paddingBottom - (Math.max(item.open, item.close) - yAxisMinValue) * (canvasRef.current.height - paddingBottom) / (yAxisMaxValue - yAxisMinValue),
        candleWidth,
        Math.abs(item.close - item.open) * (canvasRef.current.height - paddingBottom) / (yAxisMaxValue - yAxisMinValue)
      );
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (data && data.length > 0) {
      drawCandlestickChart(data, ctx);
    }

    // 데이터가 변경되었을 때 차트를 다시 그립니다.
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [data]);

  return <canvas ref={canvasRef}></canvas>;
};

export default EasyChart;
