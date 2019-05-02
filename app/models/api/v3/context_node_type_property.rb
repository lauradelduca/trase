# == Schema Information
#
# Table name: context_node_type_properties
#
#  id                                                                                      :integer          not null, primary key
#  context_node_type_id                                                                    :integer          not null
#  column_group(Zero-based number of sankey column in which to display nodes of this type) :integer          not null
#  is_default(When set, show this node type as default (only use for one))                 :boolean          default(FALSE), not null
#  is_geo_column(When set, show nodes on map)                                              :boolean          default(FALSE), not null
#  is_choropleth_disabled(When set, do not display the map choropleth)                     :boolean          default(FALSE), not null
#  role                                                                                    :string
#
# Indexes
#
#  context_node_type_properties_context_node_type_id_key       (context_node_type_id) UNIQUE
#  index_context_node_type_properties_on_context_node_type_id  (context_node_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#

module Api
  module V3
    class ContextNodeTypeProperty < YellowTable
      COLUMN_GROUP = [
        0, 1, 2, 3
      ].freeze

      SOURCE_ROLE = 'source'.freeze
      EXPORTER_ROLE = 'exporter'.freeze
      IMPORTER_ROLE = 'importer'.freeze
      DESTINATION_ROLE = 'destination'.freeze

      ROLES = [
        SOURCE_ROLE, EXPORTER_ROLE, IMPORTER_ROLE, DESTINATION_ROLE
      ].freeze

      before_save :nilify_role,
                  if: -> { role.blank? }

      belongs_to :context_node_type

      validates :context_node_type, presence: true, uniqueness: true
      validates :column_group, presence: true, inclusion: COLUMN_GROUP
      validates :is_default, inclusion: {in: [true, false]}
      validates :is_geo_column, inclusion: {in: [true, false]}
      validates :is_choropleth_disabled, inclusion: {in: [true, false]}
      validates :role, inclusion: ROLES, allow_nil: true, allow_blank: true

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end

      def self.roles
        ROLES
      end

      private

      def nilify_role
        self.role = nil
      end
    end
  end
end
