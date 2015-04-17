class EventsController < ApplicationController
  require 'eventbrite-client'
  require 'json'

  def index
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(city: "San Francisco", date: "Next Month", keywords: "DJ Clubbing")
    @events = resp['events']
  end

  def search
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(city: "San Francisco", date: "Next Month", keywords: "DJ Clubbing")

    respond_to do |format|
      format.html { render html: resp }
      format.json { render json: resp }
    end
  end

  def raw
    get 'https://www.eventbriteapi.com/v3/events/search/?q=dj+clubbing&venue.city=San+Francisco&venue.region=California&token=2GT6L3NCHSCTQQREGLKO'
  end
end
