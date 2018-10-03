module Api
  module V3
    module Dashboards
      class TemplatesController < ApiController
        skip_before_action :load_context

        def index
          render json: Api::V3::DashboardTemplate.all,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::TemplateSerializer
        end
      end
    end
  end
end
