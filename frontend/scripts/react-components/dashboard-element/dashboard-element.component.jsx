import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal.component';
import DashboardPanel from 'react-components/dashboard-element/dashboard-panel/dashboard-panel.container';
import DashboardWelcome from 'react-components/dashboard-element/dashboard-welcome.component';
import DashboardIndicators from 'react-components/dashboard-element/dashboard-indicators/dashboard-indicators.container';
import DashboardWiget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.container';

class DashboardElement extends React.PureComponent {
  static propTypes = {
    activeIndicators: PropTypes.array,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired,
    editMode: PropTypes.bool.isRequired,
    reopenPanel: PropTypes.func.isRequired,
    goToRoot: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    dynamicSentenceParts: PropTypes.array
  };

  static steps = {
    WELCOME: 0,
    PANEL: 1,
    INDICATORS: 2
  };

  renderDashboardModal() {
    const { step, setStep, editMode, goToRoot, modalOpen, closeModal } = this.props;
    const onClose = !editMode ? goToRoot : closeModal;

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
        <SimpleModal isOpen={modalOpen} onRequestClose={onClose} className="no-events">
          <div className="dashboard-modal-content all-events">
            <div className="dashboard-modal-close">
              <button onClick={onClose}>
                <span>close</span>
                <svg className="icon icon-close">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            </div>
            {step === DashboardElement.steps.WELCOME && (
              <DashboardWelcome onContinue={() => setStep(DashboardElement.steps.PANEL)} />
            )}
            {step === DashboardElement.steps.PANEL && (
              <DashboardPanel
                editMode={editMode}
                onContinue={() =>
                  editMode ? closeModal() : setStep(DashboardElement.steps.INDICATORS)
                }
              />
            )}
            {step === DashboardElement.steps.INDICATORS && (
              <DashboardIndicators
                editMode={editMode}
                onContinue={closeModal}
                goBack={() => setStep(DashboardElement.steps.PANEL)}
              />
            )}
          </div>
        </SimpleModal>
      </React.Fragment>
    );
  }

  renderDynamicSentence() {
    const { dynamicSentenceParts } = this.props;

    if (dynamicSentenceParts) {
      return dynamicSentenceParts.map((part, i) => (
        <React.Fragment key={part.prefix + part.value + i}>
          {`${part.prefix} `}
          {part.value && (
            <span className="dashboard-element-title-item notranslate">{part.value}</span>
          )}
        </React.Fragment>
      ));
    }

    return 'Dashboards';
  }

  render() {
    const { modalOpen, activeIndicators, reopenPanel } = this.props;
    return (
      <div className="l-dashboard-element">
        <div className="c-dashboard-element">
          <section className="dashboard-element-header">
            <div className="row">
              <div className="column small-12">
                <h2 className="dashboard-element-title">{this.renderDynamicSentence()}</h2>
              </div>
            </div>
            <div className="row">
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions">
                  <button
                    type="button"
                    className="c-button -gray -medium dashboard-header-action -panel"
                    onClick={() => reopenPanel(DashboardElement.steps.PANEL)}
                  >
                    Edit Options
                  </button>
                  <button
                    type="button"
                    className="c-button -gray-transparent -medium dashboard-header-action -panel"
                    onClick={() => reopenPanel(DashboardElement.steps.INDICATORS)}
                  >
                    Edit Indicators
                  </button>
                </div>
              </div>
              <div className="column small-12 medium-6">
                <div className="dashboard-header-actions -end">
                  <a
                    href={false}
                    className="dashboard-header-action -link"
                    onClick={() => alert('coming soon')}
                  >
                    <svg className="icon icon-download">
                      <use xlinkHref="#icon-download" />
                    </svg>
                    DOWNLOAD
                  </a>
                  <a
                    href={false}
                    className="dashboard-header-action -link"
                    onClick={() => alert('coming soon')}
                  >
                    <svg className="icon icon-share">
                      <use xlinkHref="#icon-share" />
                    </svg>
                    SHARE
                  </a>
                </div>
              </div>
            </div>
          </section>
          {this.renderDashboardModal()}
          {modalOpen === false && (
            <section className="dashboard-element-widgets">
              <div className="row -equal-height -flex-end">
                {activeIndicators.map(indicator => (
                  <div key={indicator.id} className="column small-12 medium-6 ">
                    <DashboardWiget
                      url={indicator.url}
                      title={indicator.displayName}
                      chartType={indicator.chartType}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }
}

export default DashboardElement;
