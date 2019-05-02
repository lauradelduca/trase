# == Schema Information
#
# Table name: qual_commodity_properties
#
#  id                                                                                                                                                                                                                          :bigint(8)        not null, primary key
#  tooltip_text(Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.) :text             not null
#  commodity_id(Reference to commodity)                                                                                                                                                                                        :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                                                                  :bigint(8)        not null
#
# Indexes
#
#  index_qual_commodity_properties_on_commodity_id  (commodity_id)
#  index_qual_commodity_properties_on_qual_id       (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QualCommodityProperty < YellowTable
      belongs_to :commodity
      belongs_to :qual

      validates :commodity, presence: true
      validates :qual, presence: true, uniqueness: {scope: :commodity}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end
    end
  end
end
