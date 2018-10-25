import { connect } from 'react-redux';
import React from 'react';
import {
  clearDashboardPanel,
  setDashboardPanelPage,
  setDashboardActivePanel,
  setDashboardPanelActiveTab,
  setDashboardPanelActiveItem,
  getDashboardPanelSearchResults
} from 'react-components/dashboard-element/dashboard-element.actions';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.component';
import {
  getActivePanelTabs,
  getDirtyBlocks,
  getDynamicSentence
} from 'react-components/dashboard-element/dashboard-element.selectors';

const mapStateToProps = state => {
  const {
    activePanelId,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    data: { sources, countries, commodities, companies, destinations },
    loading
  } = state.dashboardElement;

  return {
    loading,
    sources,
    countries,
    companies,
    commodities,
    destinations,
    activePanelId,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel,
    tabs: getActivePanelTabs(state),
    dirtyBlocks: getDirtyBlocks(state),
    dynamicSentenceParts: getDynamicSentence(state)
  };
};

const mapDispatchToProps = {
  getMoreItems: setDashboardPanelPage,
  clearActiveId: clearDashboardPanel,
  setActivePanel: setDashboardActivePanel,
  setActiveTab: setDashboardPanelActiveTab,
  setActiveItem: setDashboardPanelActiveItem,
  getSearchResults: getDashboardPanelSearchResults
};

class DashboardPanelContainer extends React.PureComponent {
  panels = [
    {
      id: 'sources',
      title: 'sourcing places',
      imageUrl: '/images/dashboards/icon_sourcing.svg',
      whiteImageUrl: '/images/dashboards/icon_sourcing_white.svg'
    },
    {
      id: 'destinations',
      title: 'importing countries',
      imageUrl: '/images/dashboards/icon_importing.svg',
      whiteImageUrl: '/images/dashboards/icon_importing_white.svg'
    },
    {
      id: 'companies',
      title: 'companies',
      imageUrl: '/images/dashboards/icon_companies.svg',
      whiteImageUrl: '/images/dashboards/icon_companies_white.svg'
    },
    {
      id: 'commodities',
      title: 'commodities',
      imageUrl: '/images/dashboards/icon_commodities.svg',
      whiteImageUrl: '/images/dashboards/icon_commodities_white.svg'
    }
  ];

  render() {
    return <DashboardPanel panels={this.panels} {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPanelContainer);
