# == Schema Information
#
# Table name: profiles
#
#  id                   :integer          not null, primary key
#  context_node_type_id :integer          not null
#  name                 :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  main_topojson_path   :string
#  main_topojson_root   :string
#  adm_1_name           :string
#  adm_1_topojson_path  :string
#  adm_1_topojson_root  :string
#  adm_2_name           :string
#  adm_2_topojson_path  :string
#  adm_2_topojson_root  :string
#
# Indexes
#
#  index_profiles_on_context_node_type_id  (context_node_type_id)
#  profiles_context_node_type_id_name_key  (context_node_type_id,name) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_id => context_node_types.id) ON DELETE => cascade
#

module Api
  module V3
    class Profile < YellowTable
      ACTOR = 'actor'.freeze
      PLACE = 'place'.freeze

      NAME = [ACTOR, PLACE].freeze

      belongs_to :context_node_type
      has_many :charts, -> { order(:position) }

      validates :context_node_type, presence: true
      validates :name,
                uniqueness: {scope: :context_node_type},
                inclusion: NAME

      after_commit :refresh_dependents

      def self.select_options
        Api::V3::Profile.includes(
          context_node_type: [{context: [:country, :commodity]}, :node_type]
        ).all.map do |profile|
          context_node_type = profile&.context_node_type
          [
            [
              context_node_type&.context&.country&.name,
              context_node_type&.context&.commodity&.name,
              context_node_type&.node_type&.name,
              profile.name
            ].join(' / '),
            profile.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Node.refresh
      end
    end
  end
end
