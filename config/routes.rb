Rails.application.routes.draw do
  get 'search_analytics/index'
  post "/search_analytics", to: "search_analytics#create"
  
  resources :posts
  devise_for :users
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "posts#index"

  resources :search_analytics, only: [:index, :create]
end
