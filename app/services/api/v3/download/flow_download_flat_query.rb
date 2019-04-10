module Api
  module V3
    module Download
      class FlowDownloadFlatQuery
        def initialize(context, download_attributes, base_query)
          @context = context
          @download_attributes = download_attributes
          initialize_path_column_names(@context.id)
          @base_query = base_query
          initialize_query
        end

        def all
          @query
        end

        def total
          @base_query.count
        end

        MAX_SIZE = 500_000

        def chunk_by_year?
          total > MAX_SIZE
        end

        def years
          @base_query.distinct.pluck(:year)
        end

        def by_year(year)
          all.where(year: year)
        end

        private

        def initialize_query
          @query = @base_query.select(flat_select_columns).
            order(:path, :attribute_type, :attribute_id)
        end

        def flat_select_columns
          [
            'year AS "YEAR"'
          ] + @path_columns +
            [
              "'#{commodity_type}'::TEXT AS \"TYPE\"",
              'download_attributes_mv.display_name AS "INDICATOR"',
              'total AS "TOTAL"'
            ]
        end

        def commodity_type
          commodity_name = @context.commodity.try(:name)
          if commodity_name == 'SOY'
            'Soy bean equivalents'
          else
            "#{commodity_name.try(:humanize)} equivalents" ||
              'UNKNOWN'
          end
        end

        def initialize_path_column_names(context_id)
          context_node_types = Api::V3::ContextNodeType.
            select([:column_position, 'node_types.name']).
            where(context_id: context_id).
            joins(:node_type).
            order(:column_position)
          context_column_positions = context_node_types.pluck(:column_position)
          path_column_names = context_column_positions.map { |p| "jsonb_path->'#{p}'->'node'" }
          @path_column_aliases = context_node_types.
            pluck('node_types.name').
            map { |nt| "\"#{nt}\"" }
          @path_columns = path_column_names.each_with_index.map do |n, idx|
            "#{n} AS #{@path_column_aliases[idx]}"
          end
          @path_crosstab_columns = @path_column_aliases.map { |a| "#{a} text" }
        end
      end
    end
  end
end
