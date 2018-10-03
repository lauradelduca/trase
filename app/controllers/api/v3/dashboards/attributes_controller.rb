module Api
  module V3
    module Dashboards
      class AttributesController < ApiController
        include FilterParams
        include Collection
        skip_before_action :load_context

        def index
          initialize_collection_for_index

          render json: @collection,
                 root: 'data',
                 meta: RetrieveAttributesMeta.new.call,
                 each_serializer: Api::V3::Dashboards::AttributeSerializer
        end

        private

        def filter_klass
          RetrieveAttributes
        end
      end
    end
  end
end
