import { createSelector } from 'reselect';
import { getDynamicSentence } from 'react-components/dashboard-element/dashboard-element.selectors';
import { format } from 'd3-format';

const getData = (state, props) => props.data || null;
const getConfig = (state, props) => props.config || null;
const getSelectedYears = state => state.dashboardElement.selectedYears;

export const makeAddIndicatorsPartToSentence = () =>
  createSelector(
    [getData, getConfig, getSelectedYears, getDynamicSentence],
    (data, config, selectedYears, dynamicSentenceParts) => {
      if (!data || !config || !dynamicSentenceParts) return null;
      const { yAxisLabel } = config;
      const commoditiesPart = dynamicSentenceParts.find(p => p.id === 'commodities');
      let updatedCommoditiesPart = commoditiesPart;
      if (commoditiesPart) {
        updatedCommoditiesPart = { ...commoditiesPart, prefix: 'of' };
      }

      const indicatorNamePart = {
        id: 'indicator-name',
        prefix: '',
        value: [{ name: yAxisLabel.text }],
        transform: 'capitalize'
      };

      const indicatorValuePart = {
        id: 'indicator-value',
        prefix: 'was',
        value: [
          {
            name: data[0].y0 ? `${format(',.2f')(data[0].y0)} ${yAxisLabel.suffix}` : 'N/A'
          }
        ]
      };

      const yearPart = selectedYears
        ? {
            id: 'year',
            prefix: 'for',
            value: [
              {
                name:
                  selectedYears[0] !== selectedYears[1]
                    ? `${selectedYears[0]} - ${selectedYears[1]}`
                    : `${selectedYears[0]}`
              }
            ]
          }
        : {};

      return [
        indicatorNamePart,
        updatedCommoditiesPart,
        ...dynamicSentenceParts.filter(p => p.id !== 'commodities'),
        indicatorValuePart,
        yearPart
      ];
    }
  );
