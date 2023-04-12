class AddIndexToSearchesQuery < ActiveRecord::Migration[7.0]
  def change
    add_index :searches, :query
  end
end
