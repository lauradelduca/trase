module Api
  module V3
    module Dashboards
      module Charts
        class SingleYearNcontOverview
          include Api::V3::Dashboards::Charts::Helpers

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
          def initialize(chart_parameters)
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @year = chart_parameters.start_year
            @ncont_attribute = chart_parameters.ncont_attribute
            @nodes_ids_by_position = chart_parameters.nodes_ids_by_position
            initialize_query
          end

          def call
            @data = @query.map do |r|
              r.attributes.slice('x', 'y0').symbolize_keys
            end
            @meta = {
              xAxis: axis_meta(@ncont_attribute),
              yAxis: axis_meta(@cont_attribute),
              x: legend_meta(@ncont_attribute, 'category'),
              y0: legend_meta(@cont_attribute, 'number')
            }
            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_ncont_attribute_x
            apply_cont_attribute_y
            apply_single_year_filter
            apply_flow_path_filters
          end
        end
      end
    end
  end
end
