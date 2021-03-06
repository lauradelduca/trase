import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import DashboardWidgetComponent from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import DashboardWidgetTooltip from 'react-components/dashboard-element/dashboard-widget/dashboard-widget-tooltip';
import {
  makeGetConfig,
  makeGetChartType,
  makeGetTitle
} from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.selectors';
import { trackOpenTableView as trackOpenTableViewFn } from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.actions';

const makeMapStateToProps = () => {
  const getDashboardWidgetsConfig = makeGetConfig();
  const getChartType = makeGetChartType();
  const getTitle = makeGetTitle();
  const mapStateToProps = (state, props) => ({
    config: getDashboardWidgetsConfig(state, props),
    chartType: getChartType(state, props),
    title: getTitle(state, props),
    chartsLoading: state.dashboardElement.chartsLoading
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  trackOpenTableView: trackOpenTableViewFn
};

class DashboardWidgetContainer extends Component {
  addTooltipContentToConfig(config, meta) {
    return {
      ...config,
      tooltip: {
        ...config.tooltip,
        content: <DashboardWidgetTooltip meta={meta} />
      }
    };
  }

  getPluralNodeType = nodeType => {
    const name = camelCase(nodeType);
    return (
      {
        country: 'importing countries',
        municipality: 'municipalities',
        countryOfProduction: 'countries of production',
        portOfExport: 'ports of export',
        portOfImport: 'ports of import'
      }[name] || `${nodeType}s`.toLowerCase()
    );
  };

  render() {
    const {
      data,
      loading,
      error,
      meta,
      config,
      chartType,
      chartsLoading,
      title,
      trackOpenTableView
    } = this.props;
    return config ? (
      <DashboardWidgetComponent
        data={data}
        meta={meta}
        error={error}
        trackOpenTableView={trackOpenTableView}
        loading={loading || chartsLoading}
        chartConfig={this.addTooltipContentToConfig(config, meta)}
        chartType={chartType}
        title={title}
      />
    ) : null;
  }
}

DashboardWidgetContainer.propTypes = {
  error: PropTypes.bool,
  data: PropTypes.array,
  meta: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
  config: PropTypes.object,
  chartType: PropTypes.string,
  chartsLoading: PropTypes.bool,
  trackOpenTableView: PropTypes.func
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(DashboardWidgetContainer);
