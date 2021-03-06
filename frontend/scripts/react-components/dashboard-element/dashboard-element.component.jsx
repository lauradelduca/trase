import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome/dashboard-welcome.component';
import Button from 'react-components/shared/button/button.component';
import TagsGroup from 'react-components/shared/tags-group';
import RecolorBy from 'react-components/shared/recolor-by';
import Dropdown from 'react-components/shared/dropdown';
import YearsRangeDropdown from 'react-components/shared/years-range-dropdown';
import Text from 'react-components/shared/text';
import DashboardWidget from 'react-components/dashboard-element/dashboard-widget';
import InView from 'react-components/shared/in-view.component';
import cx from 'classnames';
import { DASHBOARD_STEPS } from 'constants';

import 'react-components/dashboard-element/dashboard-element.scss';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    charts: PropTypes.array,
    dirtyBlocks: PropTypes.object,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    goToRoot: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    reopenPanel: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      years: PropTypes.array,
      resizeBy: PropTypes.array,
      selectedYears: PropTypes.array,
      selectedResizeBy: PropTypes.object,
      selectedRecolorBy: PropTypes.object,
      recolorBy: PropTypes.array.isRequired
    }).isRequired,
    dynamicSentenceParts: PropTypes.array,
    setSelectedYears: PropTypes.func.isRequired,
    setSelectedResizeBy: PropTypes.func.isRequired,
    setSelectedRecolorBy: PropTypes.func.isRequired
  };

  renderStep() {
    const { step, setStep, editMode, closeModal, dirtyBlocks } = this.props;
    const showBackButton = step > DASHBOARD_STEPS.sources;
    const onContinue = step === DASHBOARD_STEPS.companies ? closeModal : () => setStep(step + 1);
    if (step === DASHBOARD_STEPS.welcome) {
      return <DashboardWelcome onContinue={() => setStep(step + 1)} />;
    }
    return (
      <DashboardPanel
        step={step}
        editMode={editMode}
        onContinue={onContinue}
        dirtyBlocks={dirtyBlocks}
        onBack={showBackButton ? () => setStep(step - 1) : undefined}
      />
    );
  }

  renderDashboardModal() {
    const { editMode, goToRoot, modalOpen, closeModal, dirtyBlocks } = this.props;
    const canProceed = dirtyBlocks.countries && dirtyBlocks.commodities;
    const onClose = editMode && canProceed ? closeModal : goToRoot;
    return (
      <React.Fragment>
        {modalOpen && (
          <section className="dashboard-element-placeholder">
            <div className="row">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="column small-12 medium-6">
                  <b className="dashboard-element-placeholder-item" />
                </div>
              ))}
            </div>
          </section>
        )}
        <SimpleModal isOpen={modalOpen} onClickClose={onClose}>
          {this.renderStep()}
        </SimpleModal>
      </React.Fragment>
    );
  }

  renderDynamicSentence() {
    const { dynamicSentenceParts, step } = this.props;
    if (dynamicSentenceParts) {
      return <TagsGroup readOnly step={step} color="white" tags={dynamicSentenceParts} />;
    }
    return 'Dashboards';
  }

  renderWidgets() {
    const { charts, filters } = this.props;

    return charts.map((chart, widgetIndex) => (
      <InView triggerOnce>
        {({ ref, inView }) => (
          <div
            key={chart.id}
            className="column small-12 medium-6"
            data-test="dashboard-widget-container"
            ref={ref}
          >
            {(widgetIndex < 2 || inView) && (
              <DashboardWidget
                url={chart.url}
                chartType={chart.type}
                selectedRecolorBy={filters.selectedRecolorBy}
              />
            )}
          </div>
        )}
      </InView>
    ));
  }

  render() {
    const {
      charts,
      modalOpen,
      goToRoot,
      filters,
      reopenPanel,
      setSelectedYears,
      setSelectedResizeBy,
      setSelectedRecolorBy
    } = this.props;

    const hasCharts = charts.length > 0;
    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          {this.renderDashboardModal()}
          {modalOpen === false && (
            <>
              <section className="dashboard-element-header">
                <div className="row">
                  <div className="column small-12">
                    <h2 className="dashboard-element-title" data-test="dashboard-element-title">
                      {this.renderDynamicSentence()}
                      <Button
                        size="sm"
                        type="button"
                        color="gray"
                        variant="icon"
                        className="dashboard-edit-button"
                        onClick={() => reopenPanel(DASHBOARD_STEPS.sources)}
                      >
                        <svg className="icon icon-pen">
                          <use xlinkHref="#icon-pen" />
                        </svg>
                      </Button>
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="column small-12 medium-9">
                    <div className="dashboard-header-filters">
                      <div className="dashboard-filter">
                        <YearsRangeDropdown
                          color="white"
                          years={filters.years}
                          selectYears={setSelectedYears}
                          selectedYears={filters.selectedYears}
                        />
                      </div>
                      <div className="dashboard-filter">
                        <Dropdown
                          color="white"
                          label="Units"
                          placement="bottom-start"
                          onChange={setSelectedResizeBy}
                          options={filters.resizeBy}
                          value={filters.selectedResizeBy}
                        />
                      </div>
                      {filters.recolorBy.length > 0 && (
                        <div className="dashboard-filter">
                          <RecolorBy
                            color="white"
                            label="Indicator"
                            recolorGroups={[]}
                            recolorBys={filters.recolorBy}
                            onChange={setSelectedRecolorBy}
                            selectedRecolorBy={filters.selectedRecolorBy}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="column small-12 medium-3">
                    <div className="dashboard-header-links">
                      <button
                        className="dashboard-header-link"
                        onClick={() => alert('coming soon')}
                      >
                        <svg className="icon icon-download">
                          <use xlinkHref="#icon-download" />
                        </svg>
                        DOWNLOAD
                      </button>
                      <button
                        className="dashboard-header-link"
                        onClick={() => alert('coming soon')}
                      >
                        <svg className="icon icon-share">
                          <use xlinkHref="#icon-share" />
                        </svg>
                        SHARE
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section className="dashboard-element-widgets">
                <div className={cx('row', { '-equal-height -flex-end': hasCharts })}>
                  {hasCharts && this.renderWidgets()}
                  {!hasCharts && (
                    <div className="column small-12">
                      <div className="dashboard-element-fallback">
                        <Text
                          color="white"
                          size="md"
                          align="center"
                          className="dashboard-element-fallback-text"
                        >
                          Your dashboard has no selection.
                        </Text>
                        <Button
                          color="gray-transparent"
                          size="medium"
                          className="dashboard-element-fallback-button"
                          onClick={goToRoot}
                        >
                          Go Back
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardElement;
