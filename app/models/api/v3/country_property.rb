# == Schema Information
#
# Table name: country_properties
#
#  id                        :integer          not null, primary key
#  country_id                :integer          not null
#  latitude                  :float            not null
#  longitude                 :float            not null
#  zoom                      :integer          not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  annotation_position_x_pos :float
#  annotation_position_y_pos :float
#
# Indexes
#
#  country_properties_country_id_key       (country_id) UNIQUE
#  index_country_properties_on_country_id  (country_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class CountryProperty < YellowTable
      belongs_to :country

      validates :country, presence: true, uniqueness: true
      validates :latitude, presence: true
      validates :longitude, presence: true
      validates :zoom, presence: true, inclusion: {in: 0..18}

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
