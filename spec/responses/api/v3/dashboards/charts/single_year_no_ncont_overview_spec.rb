require 'rails_helper'
require 'responses/api/v3/dashboards/charts/required_chart_parameters_examples.rb'

RSpec.describe 'Charts::SingleYearNoNcontOverview', type: :request do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ResizeByAttribute.refresh(sync: true, skip_dependents: true)
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }

  describe 'GET /api/v3/dashboards/charts/single_year_no_ncont_overview' do
    let(:url) { '/api/v3/dashboards/charts/single_year_no_ncont_overview' }
    let(:filter_params) {
      {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: cont_attribute.id,
        sources_ids: api_v3_municipality_node.id,
        companies_ids: [api_v3_exporter1_node.id, api_v3_exporter1_node.id].join(','),
        destinations_ids: api_v3_country_of_destination1_node.id,
        start_year: 2015
      }
    }
    include_examples 'required chart parameters'

    it 'has the correct response structure' do
      get url, params: filter_params

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_charts_single_year_no_ncont_overview')
    end
  end
end
