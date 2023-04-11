# app/controllers/search_analytics_controller.rb
class SearchAnalyticsController < ApplicationController
  before_action :authenticate_user!

  def create
    Search.record_query(params[:query])
    head :ok
  end

  def index
    @searches = Search.order(counter: :desc)
  end
end
