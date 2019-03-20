import React from 'react';
import CHART_CONFIG from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-config';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import { format } from 'd3-format';

const meta = {
  xAxis: {
    label: 'Year',
    prefix: '',
    format: '',
    suffix: ''
  },
  yAxis: {
    label: 'Trade volume',
    prefix: '',
    format: '',
    suffix: 't'
  },
  x: {
    type: 'category',
    label: 'Year',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  },
  y1: {
    type: 'number',
    label: 'Trade Volume',
    tooltip: {
      prefix: '',
      format: '',
      suffix: ''
    }
  },
  y2: {
    type: 'number',
    label: 'Production of Soy',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  },
  x1: {
    label: 'Trade Volume',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  },
  x2: {
    label: 'Production of Soy',
    tooltip: {
      prefix: '',
      format: '',
      suffix: 't'
    }
  }
};

const getTooltip = chartType => ({
  cursor: {
    opacity: 0.5,
    stroke: '#9a1e2a',
    strokeWidth: 2
  },
  content: <DashboardWidgetTooltip meta={meta} {...CHART_CONFIG[chartType].tooltip} />
});

const color = [{ label: 'Production of soy', color: '#ee5463' }];

const colors = [
  { label: 'Trade volume', color: '#fff0c2' },
  { label: 'Production of soy', color: '#ee5463' }
];

const lineConfig = {
  ...CHART_CONFIG.line,
  tooltip: getTooltip('line'),
  colors,
  yKeys: {
    lines: {
      y1: { fill: '#fff0c2', stroke: '#fff0c2' },
      y2: { fill: '#ee5463', stroke: '#ee5463' }
    }
  },
  yAxisLabel: { text: 'Label', suffix: 't' }
};

export default {
  line: lineConfig,
  bar: {
    ...lineConfig,
    type: 'bar',
    yKeys: {
      bars: {
        y1: { fill: '#fff0c2', stroke: '#fff0c2', interval: 'preserveStartEnd' },
        y2: { fill: '#ee5463', stroke: '#ee5463', interval: 'preserveStartEnd' }
      }
    }
  },
  stackedBar: {
    ...lineConfig,
    type: 'bar',
    yKeys: {
      bars: {
        y1: { fill: '#fff0c2', stroke: '#fff0c2', interval: 'preserveStartEnd', stackId: 'bar' },
        y2: { fill: '#fd7d8a', stroke: '#fd7d8a', interval: 'preserveStartEnd', stackId: 'bar' }
      }
    }
  },
  horizontalBar: {
    ...CHART_CONFIG.horizontalBar,
    colors: color,
    tooltip: getTooltip('horizontalBar'),
    type: 'bar',
    xKeys: {
      bars: {
        x1: { fill: '#fd7d8a', stroke: '#fd7d8a', interval: 'preserveStartEnd' }
      }
    },
    unit: 't',
    unitFormat: value => format('.2s')(value),
    yAxisLabel: {
      text: 'Exporter Companies'
    },
    margin: { left: 120 }
  },
  horizontalStackedBar: {
    ...CHART_CONFIG.horizontalBar,
    colors,
    tooltip: getTooltip('horizontalBar'),
    type: 'bar',
    xKeys: {
      bars: {
        x1: {
          fill: '#fff0c2',
          stroke: '#fff0c2',
          interval: 'preserveStartEnd',
          stackId: 'bar',
          nameKey: 'x'
        },
        x2: {
          fill: '#fd7d8a',
          stroke: '#fd7d8a',
          interval: 'preserveStartEnd',
          stackId: 'bar',
          nameKey: 'x'
        }
      }
    },
    margin: { left: 120 },
    unit: 't',
    unitFormat: value => format('.2s')(value),
    yAxisLabel: {
      text: 'Exporter Companies'
    }
  },
  pie: {
    ...CHART_CONFIG.pie,
    tooltip: getTooltip('pie'),
    colors,
    type: 'pie',
    yKeys: {
      pies: {
        y1: {
          nameKey: 'x',
          innerRadius: '60%',
          outerRadius: '80%'
        }
      }
    }
  }
};
