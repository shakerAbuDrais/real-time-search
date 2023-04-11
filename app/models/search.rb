# app/models/search.rb
class Search < ApplicationRecord
  validates :query, presence: true

  def self.record_query(query)
    search = find_or_initialize_by(query: query)
    search.counter ||= 0
    search.counter += 1
    search.save
  end
end
