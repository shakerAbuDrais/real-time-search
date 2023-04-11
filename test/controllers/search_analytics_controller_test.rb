require "test_helper"

class SearchAnalyticsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get search_analytics_index_url
    assert_response :success
  end
end
