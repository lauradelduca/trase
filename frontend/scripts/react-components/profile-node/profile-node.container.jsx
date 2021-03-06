import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GET_PROFILE_METADATA } from 'utils/getURLFromParams';
import Widget from 'react-components/widgets/widget.component';
import ProfileNode from 'react-components/profile-node/profile-node.component';

class ProfileNodeContainer extends React.PureComponent {
  static propTypes = {
    context: PropTypes.object,
    nodeId: PropTypes.string
  };

  render() {
    const { context, nodeId } = this.props;
    return (
      <Widget query={[GET_PROFILE_METADATA]} params={[{ context_id: context.id, node_id: nodeId }]}>
        {({ data = {}, loading, error }) => (
          <ProfileNode
            {...this.props}
            errorMetadata={error}
            loadingMetadata={loading}
            profileMetadata={data[GET_PROFILE_METADATA]}
          />
        )}
      </Widget>
    );
  }
}

function mapStateToProps(state) {
  const {
    query: { year, nodeId, print, contextId = 1 } = {},
    payload: { profileType }
  } = state.location;
  const { tooltips, contexts } = state.app;
  const ctxId = contextId && parseInt(contextId, 10);
  const context = contexts.find(ctx => ctx.id === ctxId) || { id: ctxId };
  return {
    tooltips,
    context,
    profileType,
    printMode: print && JSON.parse(print),
    year: parseInt(year, 10),
    nodeId: parseInt(nodeId, 10)
  };
}

const updateQueryParams = (profileType, query) => ({
  type: 'profileNode',
  payload: { query, profileType }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateQueryParams
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileNodeContainer);
