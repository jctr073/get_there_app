class EventsController < ApplicationController
  require 'eventbrite-client'
  require 'json'

  def index
    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(postal_code: "94110", sort_by: "date")
    @events = resp['events']
  end


end
