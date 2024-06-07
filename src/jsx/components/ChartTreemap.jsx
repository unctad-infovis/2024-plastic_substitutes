import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

// https://www.highcharts.com/
import Highcharts from 'highcharts';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsExportData from 'highcharts/modules/export-data';
import highchartsTreemap from 'highcharts/modules/treemap';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import roundNr from '../helpers/RoundNr.js';

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);
highchartsTreemap(Highcharts);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    downloadCSV: 'Download CSV data',
    thousandsSep: ' '
  }
});
Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
  const path = [
    // Arrow stem
    'M', x + w * 0.5, y,
    'L', x + w * 0.5, y + h * 0.7,
    // Arrow head
    'M', x + w * 0.3, y + h * 0.5,
    'L', x + w * 0.5, y + h * 0.7,
    'L', x + w * 0.7, y + h * 0.5,
    // Box
    'M', x, y + h * 0.9,
    'L', x, y + h,
    'L', x + w, y + h,
    'L', x + w, y + h * 0.9
  ];
  return path;
};

function TreemapChart({
  allow_decimals, data, idx, note, show_first_label, source, subtitle, title
}) {
  const chartRef = useRef();
  const isVisible = useIsVisible(chartRef, { once: true });

  const chartHeight = 650;
  const createChart = useCallback(() => {
    Highcharts.chart(`chartIdx${idx}`, {
      caption: {
        align: 'left',
        margin: 15,
        style: {
          color: '#231f20',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 300,
          lineHeight: '14.4px'
        },
        text: `<em>Source:</em> ${source} ${note ? (`<br /><em>Note:</em> <span>${note}</span>`) : ''}`,
        verticalAlign: 'bottom',
        x: 0
      },
      chart: {
        events: {
          load() {
            const chart_element = this;
            chart_element.renderer.image('https://static.dwcdn.net/custom/themes/unctad-2024-rebrand/Blue%20arrow.svg', 15, 15, 44, 43.88).add();
          }
        },
        height: chartHeight,
        resetZoomButton: {
          theme: {
            fill: '#fff',
            r: 0,
            states: {
              hover: {
                fill: '#0077b8',
                stroke: 'transparent',
                style: {
                  color: '#fff',
                  fontFamily: 'Inter',
                }
              }
            },
            stroke: '#7c7067',
            style: {
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: 400
            }
          }
        },
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Inter',
          fontWeight: 400
        },
        type: 'treemap'
      },
      colors: ['#006846', '#72bf44', '#009edb', '#004987'],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV'],
            symbol: 'download',
            symbolFill: '#000'
          }
        }
      },
      legend: {
        align: 'right',
        enabled: true,
        itemDistance: 20,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 400
        },
        layout: 'horizontal',
        verticalAlign: 'top'
      },
      plotOptions: {
        treemap: {
          alternateStartingDirection: true,
          layoutAlgorithm: 'sliceAndDice',
          layoutStartingDirection: 'vertical',
          dataLabels: {
            formatter() {
              // eslint-disable-next-line react/no-this-in-sfc
              return (this.key !== 'Other Natural Fibres') ? `${this.key}<br /><strong>$${roundNr(this.point.value).toLocaleString('en-US').replace(',', ' ')}</strong>` : this.key;
            }
          },
          levels: [{
            borderColor: '#000',
            borderWidth: 2,
            level: 1
          }, {
            borderColor: '#000',
            borderWidth: 2,
            level: 2
          }, {
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            layoutAlgorithm: 'stripes',
            layoutStartingDirection: 'horizontal',
            level: 3
          }]
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            title: {
              margin: 20
            },
            plotOptions: {
              packedbubble: {
                maxSize: '200%'
              }
            }
          },
          condition: {
            maxWidth: 630
          }
        }, {
          chartOptions: {
            chart: {
              height: 700
            },
            legend: {
              layout: 'horizontal'
            },
            title: {
              style: {
                fontSize: '26px',
                lineHeight: '30px'
              }
            }
          },
          condition: {
            maxWidth: 500
          }
        }, {
          chartOptions: {
            chart: {
              height: 800
            }
          },
          condition: {
            maxWidth: 400
          }
        }]
      },
      series: [{
        data
      }],
      subtitle: {
        align: 'left',
        enabled: true,
        style: {
          color: '#231f20',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '19.2px',
        },
        text: subtitle,
        useHTML: true,
        widthAdjust: -100,
        x: 64
      },
      title: {
        align: 'left',
        margin: 20,
        style: {
          color: '#231f20',
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: '26.4px',
        },
        text: title,
        widthAdjust: -144,
        x: 64,
        y: 20
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        crosshairs: false,
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          return `<div class="tooltip_container"><div class="tooltip_header">${this.key}</div><div><span class="tooltip_label"></span> <span class="tooltip_value">$${roundNr(this.point.value, 0).toLocaleString('en-US').replace(',', ' ')}</span></div></div>`;
        },
        shadow: false,
        shared: true,
        useHTML: true
      },
      xAxis: {
        allowDecimals: false,
        labels: {
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400
          },
          useHTML: false,
          y: 30
        },
        lineColor: '#ccc',
        lineWidth: 0,
        opposite: false,
        tickLength: 5,
        tickWidth: 1,
        type: 'linear',
        title: {
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400
          },
          text: ''
        }
      },
      yAxis: [{
        allowDecimals: allow_decimals,
        gridLineColor: 'rgba(124, 112, 103, 0.2)',
        gridLineDashStyle: 'shortdot',
        gridLineWidth: 1,
        labels: {
          reserveSpace: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400
          }
        },
        lineColor: 'transparent',
        lineWidth: 0,
        opposite: false,
        showFirstLabel: show_first_label,
        showLastLabel: true,
        title: {
          enabled: true,
          reserveSpace: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400
          },
          text: ''
        },
        type: 'linear'
      }]
    });
    chartRef.current.querySelector(`#chartIdx${idx}`).style.opacity = 1;
  }, [allow_decimals, data, idx, note, show_first_label, source, subtitle, title]);

  useEffect(() => {
    if (isVisible === true) {
      setTimeout(() => {
        createChart();
      }, 300);
    }
  }, [createChart, isVisible]);

  return (
    <div className="chart_container">
      <div ref={chartRef}>
        {(isVisible) && (<div className="chart" id={`chartIdx${idx}`} />)}
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

TreemapChart.propTypes = {
  allow_decimals: PropTypes.bool,
  data: PropTypes.instanceOf(Array).isRequired,
  idx: PropTypes.string.isRequired,
  note: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  show_first_label: PropTypes.bool,
  source: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

TreemapChart.defaultProps = {
  allow_decimals: true,
  note: false,
  show_first_label: true,
  subtitle: false,
};

export default TreemapChart;
