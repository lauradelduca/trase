# == Schema Information
#
# Table name: dashboards_attributes_mv
#
#  id                            :bigint(8)        primary key
#  dashboards_attribute_group_id :bigint(8)
#  position                      :integer
#  chart_type                    :string
#  created_at                    :datetime
#  updated_at                    :datetime
#  attribute_id                  :bigint(8)
#
# Indexes
#
#  dashboards_attributes_mv_group_id_attribute_id_idx  (dashboards_attribute_group_id,attribute_id)
#  dashboards_attributes_mv_id_idx                     (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class DashboardsAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'dashboards_attributes_mv'
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute

        def self.refresh_dependencies(options = {})
          Api::V3::Readonly::Attribute.refresh(options.merge(skip_dependents: true))
        end

        def self.refresh_dependents(options = {})
          [
            Api::V3::Readonly::Dashboards::FlowAttribute,
            Api::V3::Readonly::Dashboards::NodeAttribute
          ].each do |mview_klass|
            mview_klass.refresh(options.merge(skip_dependencies: true))
          end
        end
      end
    end
  end
end
