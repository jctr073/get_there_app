class EventsController < ApplicationController
  require 'eventbrite-client'
  require 'json'

  def index
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(city: "San Francisco")
    @events = resp['events']
  end

  def search
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(city: "San Francisco")

    respond_to do |format|
      format.html { render html: resp }
      format.json { render json: resp }
    end
  end
end
