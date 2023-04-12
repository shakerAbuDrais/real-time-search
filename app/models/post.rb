class Post < ApplicationRecord
    def index
        if params[:search].present?
          Search.record_query(params[:search])
          @posts = Post.where("title ILIKE ?", "%#{params[:search]}%")
        else
          @posts = Post.all
        end
      
        respond_to do |format|
          format.html
          format.json { render json: @posts }
        end
      end
end
