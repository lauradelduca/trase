import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import fuzzySearch from 'utils/fuzzySearch';

const getAppContexts = state => state.app.contexts;
const getAppSearch = state => state.app.search;

const getGroupedAppSearchResults = createSelector(
  [getAppSearch, getAppContexts],
  (search, contexts) => {
    function byContextMainIdAndNodeType({ mainId, contextId, nodeType }) {
      const nodeTypeGroup = ['IMPORTER', 'EXPORTER'].includes(nodeType.toUpperCase())
        ? 'IM_EX'
        : nodeType;
      return `${contextId}_${mainId}_${nodeTypeGroup}`;
    }

    function getNodeTypeText(nodes) {
      const nodeType = nodes.map(n => n.nodeType).join(' & ');
      const ctx = contexts.find(c => c.id === nodes[0].contextId);

      if (!ctx) return nodeType;

      return `${nodeType} - ${ctx.commodityName} - ${ctx.countryName}`;
    }

    const grouped = groupBy(search.results, byContextMainIdAndNodeType);

    return Object.values(grouped).map(nodes => {
      const node = nodes[0];
      const { defaultYear = null } = contexts.find(c => c.id === node.contextId) || {};

      return {
        nodes,
        defaultYear,
        name: node.name,
        contextId: node.contextId,
        isSubnational: node.isSubnational,
        nodeTypeText: getNodeTypeText(nodes, contexts)
      };
    });
  }
);

export const getAppSearchResults = createSelector(
  [getGroupedAppSearchResults, getAppSearch],
  (groupedSearchResults, search) => fuzzySearch(search.term, groupedSearchResults)
);
