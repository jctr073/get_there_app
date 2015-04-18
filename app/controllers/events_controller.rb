class EventsController < ApplicationController
  require 'eventbrite-client'
  require 'json'

  def index
    render :search
  end

  def search
    words = params[:search][:keywords] || ""
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(city: "San Francisco", keywords: words, sort_by: "date")

    respond_to do |format|
      format.html { render html: resp }
      format.json { render json: resp }
    end
  end

end
