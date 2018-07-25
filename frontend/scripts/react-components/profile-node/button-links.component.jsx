import React from 'react';
import PropTypes from 'prop-types';
import addApostrophe from 'utils/addApostrophe';
import capitalize from 'lodash/capitalize';
import Link from 'redux-first-router-link';
import withWidget from 'react-components/widgets/with-widget.hoc';

function ButtonLinks(props) {
  const {
    year,
    nodeId,
    contextId,
    data: { nodeName, municipalityName }
  } = props;
  const name = nodeName || municipalityName;
  return (
    <div className="c-anchor-buttons hide-for-small">
      <div className="row">
        <div className="small-4 columns">
          <a href="#profile-content-anchor" className="c-link-buttons -with-arrow js-link-profile">
            <img alt="" src="/images/profiles/profile-main-option-1.svg" />
            <span className="js-link-button-name">
              <span className="notranslate">{name ? capitalize(name) : '-'}</span>
              {addApostrophe(name)} PROFILE
            </span>
          </a>
        </div>
        <div className="small-4 columns">
          <Link
            className="c-link-buttons"
            to={{
              type: 'tool',
              payload: {
                state: {
                  isMapVisible: true,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContextId: contextId
                }
              }
            }}
          >
            <img alt="" src="/images/profiles/profile-main-option-2.svg" />
            <span>MAP</span>
            <svg className="icon icon-external-link">
              <use xlinkHref="#icon-external-link" />
            </svg>
          </Link>
        </div>
        <div className="small-4 columns">
          <Link
            className="c-link-buttons"
            to={{
              type: 'tool',
              payload: {
                state: {
                  isMapVisible: false,
                  selectedNodesIds: [nodeId],
                  expandedNodesIds: [nodeId],
                  selectedYears: [year, year],
                  selectedContextId: contextId
                }
              }
            }}
          >
            <img alt="" src="/images/profiles/profile-main-option-3.svg" />
            <span>SUPPLY CHAIN</span>
            <svg className="icon icon-external-link">
              <use xlinkHref="#icon-external-link" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

ButtonLinks.propTypes = {
  data: PropTypes.any,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default withWidget(ButtonLinks);
