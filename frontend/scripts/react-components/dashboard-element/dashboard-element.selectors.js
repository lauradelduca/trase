import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getPanelId as getPanelName } from 'utils/dashboardPanel';

const getCountriesPanel = state => state.dashboardElement.countriesPanel;
const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getDestinationsPanel = state => state.dashboardElement.destinationsPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getDashboardPanelTabs = state => state.dashboardElement.tabs;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};

export const getActivePanelTabs = createSelector(
  [getActiveDashboardPanel, getDashboardPanelTabs],
  (panel, tabs) => tabs[panel.id] || []
);

export const getDirtyBlocks = createSelector(
  [
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (countriesPanel, sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel) => ({
    sources: !isEmpty(countriesPanel.activeItems),
    destinations: !isEmpty(destinationsPanel.activeItems),
    companies: !isEmpty(companiesPanel.activeItems),
    commodities: !isEmpty(commoditiesPanel.activeItems)
  })
);

export const getDynamicSentence = createSelector(
  [
    getDirtyBlocks,
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (
    dirtyBlocks,
    countriesPanel,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel
  ) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const panels = {
      countries: countriesPanel,
      sources: sourcesPanel,
      destinations: destinationsPanel,
      companies: companiesPanel,
      commodities: commoditiesPanel
    };
    const getActivePanelItem = (panelName, nodeType) => {
      if (
        !panels[panelName] ||
        !panels[panelName].activeItems ||
        isEmpty(panels[panelName].activeItems)
      ) {
        return null;
      }
      const values = Object.values(panels[panelName].activeItems);
      if (nodeType) {
        const filteredValues = values.filter(i => i.nodeType === nodeType);
        return filteredValues.length > 0 ? filteredValues : null;
      }
      return values;
    };

    const sourcesValue = getActivePanelItem('sources') || getActivePanelItem('countries');

    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: `Your dashboard will include ${
          getActivePanelItem('commodities') ? '' : 'commodities'
        }`,
        value: getActivePanelItem('commodities')
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix: sourcesValue ? `produced in` : 'produced in countries covered by Trase',
        value: sourcesValue
      },
      {
        panel: 'companies',
        id: 'exporting-companies',
        prefix: getActivePanelItem('companies', 'EXPORTER') ? 'exported by' : '',
        value: getActivePanelItem('companies', 'EXPORTER'),
        optional: true
      },
      {
        panel: 'companies',
        id: 'importing-companies',
        prefix: getActivePanelItem('companies', 'IMPORTER') ? 'imported by' : '',
        value: getActivePanelItem('companies', 'IMPORTER'),
        optional: true
      },
      {
        panel: 'destinations',
        id: 'destinations',
        prefix: getActivePanelItem('destinations') ? `going to` : '',
        value: getActivePanelItem('destinations'),
        optional: true
      }
    ];
  }
);

export const getIsDisabled = createSelector(
  [getDynamicSentence, (state, ownProps) => ownProps.step],
  (dynamicSentence, step) => {
    if (dynamicSentence.length === 0 || typeof step === 'undefined') return true;
    const currentPanel = getPanelName(step);
    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    if (!currentSentencePart.optional && !currentSentencePart.value) return true;
    return false;
  }
);
