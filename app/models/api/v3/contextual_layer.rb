# == Schema Information
#
# Table name: contextual_layers
#
#  id           :integer          not null, primary key
#  context_id   :integer          not null
#  title        :text             not null
#  identifier   :text             not null
#  position     :integer          not null
#  tooltip_text :text
#  is_default   :boolean          default(FALSE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  legend       :text
#
# Indexes
#
#  contextual_layers_context_id_identifier_key  (context_id,identifier) UNIQUE
#  contextual_layers_context_id_position_key    (context_id,position) UNIQUE
#  index_contextual_layers_on_context_id        (context_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#

module Api
  module V3
    class ContextualLayer < YellowTable
      belongs_to :context
      has_many :carto_layers

      scope :default, -> { where(is_default: true) }

      validates :context, presence: true
      validates :title, presence: true
      validates :identifier, presence: true, uniqueness: {scope: :context}
      validates :position, presence: true, uniqueness: {scope: :context}
      validates :is_default, inclusion: {in: [true, false]}

      def self.select_options
        Api::V3::ContextualLayer.includes(
          context: [:country, :commodity]
        ).all.map do |layer|
          [
            [
              layer.context&.country&.name,
              layer.context&.commodity&.name,
              layer.title
            ].join(' / '),
            layer.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
