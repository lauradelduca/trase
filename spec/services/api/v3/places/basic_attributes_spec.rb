require 'rails_helper'

RSpec.describe Api::V3::Places::BasicAttributes do
  include_context 'api v3 brazil municipality place profile'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil flows'
  include_context 'api v3 paraguay department place profile'
  include_context 'api v3 paraguay department quant values'
  include_context 'api v3 paraguay flows'

  describe :call do
    before(:each) do
      Api::V3::Readonly::Node.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end
    let(:brazil_attributes) { Api::V3::Places::BasicAttributes.new(api_v3_context, api_v3_municipality_node, 2015) }
    let(:paraguay_attributes) { Api::V3::Places::BasicAttributes.new(api_v3_paraguay_context, api_v3_paraguay_department_node, 2015) }

    it 'uses context specific quant values for production percentage calculation' do
      brazil_values = brazil_attributes.call
      paraguay_values = paraguay_attributes.call

      expect(
        brazil_values[:summary]
      ).to_not include('With of the total production')

      expect(
        brazil_values[:summary]
      ).to include('With 100.00% of the total production')

      expect(
        paraguay_values[:summary]
      ).to_not include('With of the total production')

      expect(
        paraguay_values[:summary]
      ).to include('With 100.00% of the total production')
    end
  end
end
